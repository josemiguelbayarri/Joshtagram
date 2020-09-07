import React, { useState } from 'react';//usestate nos permite declarar estados en componentes donde se importe
import { Link } from 'react-router-dom';//llamamos a la libreria router-dom y a su funcionalidad especial link para que no refresque la pagina al cambiar de vistas
import Main from '../Componentes/Main';

export default function Login({ login, mostrarError }) {//seleccionamos la propiedad login
  const [emailYPassword, setEmailYPassword] = useState({//creamos una variable con un array de dos posiciones, lo pasamos por use state y denyro colocamos dos objetos vacios
    email: '',
    password: ''
  });

  function handleInputChange(e) {//funcion para introducir los datos en el formulario de login
    setEmailYPassword({
      ...emailYPassword,//hace un copia y pega de los objetos vacios en el interior de la variable
      [e.target.name]: e.target.value //coge los datos de los input y los introduce denro de la variblae en cada objeto corresponfdiente
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();//para no hacer refresh en la pagina

    try {
      await login(emailYPassword.email, emailYPassword.password);//agarramos login y le pasamos el email y el password
    } catch (error) {
      mostrarError(error.response.data);//funcion mostrar error con su porpiedad response que es la resspuesta que nos dio el servidor y data es para mostrar esa data o response
      console.log(error);
    }
  }

  return (
    <Main center>
      <div className="FormContainer">
        <h1 className="Form__titulo">Joshtagram</h1>
        <div>
          <form onSubmit={handleSubmit}>{/* cuando el formulario se envie (onSubmit) se llamara a la funcion handleSubmit */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="Form__field"
              required
              onChange={handleInputChange}/* hacemos llamada a la funcion handleInputChange para saber en cada momento lo que se escribe en los input por el efecto onChange */
              value={emailYPassword.email}
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              className="Form__field"
              required
              onChange={handleInputChange}/* hacemos llamada a la funcion handleInputChange para saber en cada momento lo que se escribe en los input por el efecto onChange */
              value={emailYPassword.password}
            />
            <button type="submit" className="Form__submit">
              Login
            </button>
            <p className="FormContainer__info">
              No tienes cuenta? <Link to="/signup">Signup</Link> {/* usamos la carectarestica especial link para que la pagina no refresque al cambiar de vista */}
            </p>
          </form>
        </div>
      </div>
    </Main>
  );
}