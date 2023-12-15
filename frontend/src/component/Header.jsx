import {Link} from 'react-router-dom'
import{useEffect,useState,useContext} from 'react';
import{UserContext} from '../userContext'
export default function Header(){
  const {setUserInfo,userInfo}=useContext(UserContext)
;  useEffect(()=>{
    fetch('http://localhost:4000/profile',{
      credentials:'include'
    }).then(response=>{
      response.json().then(userInfo=>{
        setUserInfo(userInfo);
      })
    })
  },[]);

function logout(){
  fetch('http://localhost:4000/logout',{
    credentials: 'include',
    method: "POST",
  })
  setUserInfo(null)
}
const username= userInfo?.username;
    return(git pull origin tu-rama
        <header>
      <Link to='/' className="logo">Mi Blog</Link>
      <nav>
      {username && (
        <><Link to="/create">Crear nuevo Post</Link>
        <a onClick={logout}>Cerrar Sesion</a></>
      )}
      {!username &&(
        <>
        <Link to="/login">Ingresar</Link>
        <Link to="/register">Registrarse</Link>
        </>
      )}
      </nav>
    </header>
    )
}