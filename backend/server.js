const express =require('express');
const cors= require('cors');
const mongoose=require('mongoose');
const User = require('./models/User')
const bcrypt =require('bcryptjs');
const salt =bcrypt.genSaltSync(10);
const jwt=require('jsonwebtoken')
const cookieParser=require('cookie-parser');

const secret='asopdpoasdpo2312asdsad';
const app = express();
app.use(express.json());
app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(cookieParser())

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
app.listen(4000)
