import React from "react";
import Nav from "./Componentes/Nav";
import Signup from "./Vistas/Signup";

export default function App() {
  return (
    <div className="ContenedorTemporal">
      <Nav />
      <h1>¡Bienvenido al curso!</h1>;
      <Signup />
    </div>
  );
}



