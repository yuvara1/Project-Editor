// Desc: Main entry point for the application
import './App.css';
import Dashboard from './front/Dashboard.jsx';
import Login from './front/Login.jsx'
import Register from './front/Register.jsx'
import NotFoundPage from './front/NotFoundPage.jsx'
import Code from './front/Code.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register/>}/>
          <Route path='/dash' element={<Dashboard />} />
          <Route path='/code' element={<Code />} />
          <Route path='*' element={<NotFoundPage />}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
