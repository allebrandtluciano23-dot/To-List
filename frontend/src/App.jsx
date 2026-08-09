import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Tarefas from './pages/Tarefas';

function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/Registro' element={<Registro/>}/>
        <Route path='/tarefas' element={<Tarefas/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;