// Santy: cuando metas React Router las rutas van acá, y la guía mandala a /guia - Rojo
//Santi: ya lo hice, ahora la ruta de la guía es /guia y la del panel de admin es /admin - fexx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GuiaDeEstilo from './pages/GuiaDeEstilo';
import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GuiaDeEstilo />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}