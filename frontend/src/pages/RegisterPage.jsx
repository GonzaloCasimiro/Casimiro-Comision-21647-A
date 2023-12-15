import {useState} from 'react';
export default function RegisterPage(){
    // VARIABLES DE ESTADO  => prop1 al input.value y prop2 al evento onchange
    const[username,setUsername]=useState('');
    const[password,setPassword]=useState('');
    // Registro de usuario al enviar formulario
    async function register(e){
        e.preventDefault();
         // POST  con nombre y contraseña en JSON
            const response = await fetch('http://localhost:4000/register',{
            method:'POST',
            body: JSON.stringify({username,password}),
            headers:{'Content-Type':'application/json'},
        })
        if (response.status === 200){
            alert('Registro Exitoso :)')
        }else{
            alert('Fallo el registro ):')
        }
        
    }
    //RENDERIZA MI FORMULARIO DE REGISTRO
    return(
        <form className="register" onSubmit={register}>
        <h1>Registrarse</h1>
            <input type="text" 
            placeholder="usuario" 
            value={username}
            onChange={e=>setUsername(e.target.value)}
            />
            <input type="password" 
            placeholder="contraseña" 
            value={password}
            onChange={e=>setPassword(e.target.value)}
            />
            <button>Registrar</button>
        </form>
    )
}