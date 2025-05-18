import { useState } from 'react'
import Home from './pages/Home'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './components/login';
import Examenes from './pages/examenes';



function App() {
  const [count, setCount] = useState(0)

  return (
     
     <Router>
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/examenes" element={<Examenes />} />

      </Routes>
        

     </Router>
    
    
  )
}

export default App
