import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import TransaccionForm from "./components/transaccion/TransaccionForm.jsx";
import TransaccionList from './components/transaccion/TransaccionList.jsx';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="transaccion/list">Lista</Link>
        </li>
        <li>
          <Link to="transaccion/form">Formulario</Link>
        </li>
      </ul>
    </nav>
  );
}

function AppRoutes() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="transaccion/list" element={<TransaccionList />} />
        <Route path="transaccion/form" element={<TransaccionForm />} />
      </Routes>
    </div>
  );
}

export default App;