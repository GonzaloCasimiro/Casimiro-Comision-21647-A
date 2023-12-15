
import './App.css';
import Post from "./component/Post"
import Header from "./component/Header.jsx"
import {Route, Routes} from 'react-router-dom';
import Layout from './component/layout/Layout.jsx'
import IndexPage from './pages/IndexPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import { UserContextProvider } from './userContext.jsx';
function App() {
  return (
    <UserContextProvider>
      <Routes>
    <Route path="/" element={<Layout/>}>
      <Route index element={<IndexPage/>}/>
      <Route path={'/login'} element={<LoginPage/>}/>
      <Route path="/register" element ={<RegisterPage/>}/>
    </Route>
    </Routes>
    </UserContextProvider>
    
  );
}

export default App;
