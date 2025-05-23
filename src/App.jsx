import { useState } from 'react'
import Home from './pages/Home'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './components/login';
import Examenes from './pages/examenes';
import Registro from './components/registro';
import RecuperarCuenta from './components/RecuperarCuenta';
import HomeEstudiante from './pages/HomeEstudiante';
import HomeProfe from './pages/HomeProfe';

// --- Consideraciones de Diseño Global ---
// Tipografía:
// Se recomienda usar una o dos familias de fuentes consistentes en toda la app.
// Ejemplo: Una sans-serif para cuerpo de texto (ej. Inter, Roboto) y quizás otra para títulos (ej. Poppins, Montserrat).
// Definir una escala de tamaños de fuente (sm, base, lg, xl, 2xl, etc.) y pesos (regular, medium, bold) consistente.

// Paleta de Colores:
// La paleta principal parece basarse en tonos de Índigo y Púrpura.
// Es importante usar las variantes (ej. indigo-50, indigo-100, ..., indigo-800, indigo-900) para diferentes propósitos (fondos, textos, bordes).
// Definir colores de acento para botones, enlaces y elementos interactivos (ej. un tono de verde o azul).
// Usar colores específicos para estados (éxito, error, advertencia) de forma consistente.

// Consistencia:
// Mantener el espaciado (padding, margin) consistente usando la escala de Tailwind.
// Aplicar estilos de sombra y borde redondeado de forma uniforme en elementos similares (tarjetas, botones).


function App() {
  const [count, setCount] = useState(0)

  return (
     
     <Router>
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/examenes" element={<Examenes />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperar-cuenta" element={<RecuperarCuenta />} />
        <Route path="/home-estudiante" element={<HomeEstudiante />} />
        <Route path="/home-profe" element={<HomeProfe />} />

      </Routes>
        

     </Router>
    
    
  )
}

export default App
