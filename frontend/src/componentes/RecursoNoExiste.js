import React from 'react';
import Main from './Main';
import { Link } from 'react-router-dom';

export default function RecursoNoExiste({ mensaje }) {//recibe un prop que es un mensaje que le quieres mostrar al usuario
  return (
    <Main center>
      <div>
        <h2 className="RecursoNoExiste__mensaje">{mensaje}</h2>
        <p className="RecursoNoExiste__link-container">
          Ir al <Link to="/">home</Link> {/* recibe un link que redirige al home ya que aqui no puede hacer nada */}
        </p>
      </div>
    </Main>
  );
}
