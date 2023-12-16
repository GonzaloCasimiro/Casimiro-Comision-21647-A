const express =require('express');
const cors= require('cors');
const mongoose=require('mongoose');
const User = require('./models/User')
const Post = require('./models/Post')
const bcrypt =require('bcryptjs');
const salt =bcrypt.genSaltSync(10);
const jwt=require('jsonwebtoken')
const cookieParser=require('cookie-parser');
const multer = require('multer');
const uploadMiddelware=multer({dest:'./uploads'})
const fs=require('fs')

const secret='asopdpoasdpo2312asdsad';
const app = express();
app.use(express.json());
app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(cookieParser())
app.use('/uploads', express.static(__dirname + '/uploads'));
//CONEXION A MONGOOSE
mongoose.connect('mongodb+srv://blog:blog123@cluster0.udpj4jc.mongodb.net/blogDB?retryWrites=true&w=majority');

app.post('/register',async (req,res)=>{
    const{username,password}=req.body;
    try{
        const userDoc=await User.create({
        username,
        password:bcrypt.hashSync(password,salt),
    })
    res.json(userDoc);
}
    catch(e){
        res.status(400).json(e)
    }
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
        // Usuario no encontrado
        res.status(401).json({ error: 'Usuario no encontrado' });
        return;
    }
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
        // Contraseña correcta
        jwt.sign({username,id:userDoc._id},secret,{},(err,token)=>{
            if(err)throw err;
            res.cookie('token',token).json({
                id:userDoc._id,
                username,
            })
        });
    } else {
        // Contraseña incorrecta
        res.status(401).json( 'Contraseña incorrecta');
    }
});
app.get('/profile',(req,res)=>{
    const {token}=req.cookies;
    jwt.verify(token,secret,{},(err,info)=>{
        if (err) throw err;
        res.json(info);
    })
    res.json(req.cookies);
});
app.post('/logout',(req,res)=>{
    res.cookie('token','').json('ok');
})
app.post('/post',uploadMiddelware.single('file'),async (req,res)=>{
    const {originalname,path}=req.file;
    const parts=originalname.split('.');
    const ext=parts[parts.length - 1];
    const newPath=path+'.'+ext
    fs.renameSync(path,newPath)
    const {token}=req.cookies;
    jwt.verify(token,secret,{},async(err,info)=>{
        if (err) throw err;
        const{title,summary,content}=req.body;
        const postDoc= await Post.create({
        title,
        summary,
        content,
        cover:newPath,
        author:info.id
    })  
    res.json(postDoc);
    })
})
app.put('/post', uploadMiddelware.single('file'), async (req, res) => {
    try {
        const { id, title, summary, content } = req.body;
        const { token } = req.cookies;

        jwt.verify(token, secret, async (err, info) => {
            if (err) throw err;

            const postDoc = await Post.findById(id);

            if (!postDoc) {
                return res.status(404).json({ error: 'Publicación no encontrada' });
            }

            const isAuthor = postDoc.author.toString() === info.id;
            if (!isAuthor) {
                return res.status(403).json({ error: 'No tienes permisos para actualizar esta publicación' });
            }

            let newPath = null;
            if (req.file) {
                const { originalname, path } = req.file;
                const parts = originalname.split('.');
                const ext = parts[parts.length - 1];
                newPath = path + '.' + ext;
                fs.renameSync(path, newPath);
            }

            // Utiliza findByIdAndUpdate para actualizar el documento
            const updatedPost = await Post.findByIdAndUpdate(id, {
                title,
                summary,
                content,
                cover: newPath ? newPath : postDoc.cover,
            }, { new: true });

            res.json(updatedPost);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al intentar actualizar la publicación' });
    }
});

app.get('/post',async(req,res)=>{
    res.json(await Post.find()
    .populate('author',['username'])
    .sort({createdAt: -1})
    .limit(10)); 
    
})
app.delete('/post/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }

    // Verifica si el usuario actual es el autor de la publicación
    if (post.author.toString() !== req.userInfo.id) {
      return res.status(403).json({ error: 'No tienes permisos para eliminar esta publicación' });
    }

    // Elimina la publicación
    await post.remove();

    res.json({ message: 'Publicación eliminada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al intentar eliminar la publicación' });
  }
});

app.get('/post/:id',async(req,res)=>{
    const {id}=req.params;
    const postDoc= await Post.findById(id).populate('author',['username'])
    res.json(postDoc)
})

app.listen(4000)
