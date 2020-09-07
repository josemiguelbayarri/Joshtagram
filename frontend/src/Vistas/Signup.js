import React, { useState } from 'react'; //usestate nos permite declarar estados en componenetes donde se importe
import { Link } from 'react-router-dom';//llamamos a la libreria router-dom y a su funcionalidad especial link para que no refresque la pagina al cambiar de vistas
import Main from '../Componentes/Main';
import imagenSignup from '../imagenes/portada.png'; //importamos la imagen desde la carpeta imagenes para luego interpolarla

export default function Signup({ signup, mostrarError }) {//le pasamos nostrar error para que utilice la funcion
  const [usuario, setUsuario] = useState({ //declaramos una variable con un array de dos posiciones la 0 y la 1 y le indicamos con usestate lo que queremos que se ejecute primero metiendo dentro los objetos vacios
    email: '',
    username: '',
    password: '',
    bio: '',
    nombre: ''
  });

  function handleInputChange(e) { //esta funcion escucha el evento cada vez que cambia el valor de uno de los imputs del formulario
    setUsuario({ //llamamos a la funcion setusuario
      ...usuario, //declaramos que se haga un copy paste de todo lo que va dentro de la funciuon de arriba, es decir, los objetos vaacios
      [e.target.name]: e.target.value //el elemento acabado en .name se actualiza graciar a la decllaracion despues de los dos puntos
    });
  }

  async function handleSubmit(e) { //funcion asincrona para enviar los datos del formulario a la bae de datos
    e.preventDefault(); //para no hacer refresh en la página

    try {
      await signup(usuario);
    } catch (error) {
      mostrarError(error.response.data);//mostramos el error cogiendolo de response y mostrandolo en data
      console.log(error);
    }
  }

  return (
    <Main center={true}>  {/* le damos true a center para que afecten las propiedades css de la variable classes */}
      <div className="Signup">
        <img src={imagenSignup} alt="" className="Signup__img" /> {/* interpolamos la imagen con las llaves */}
        <div className="FormContainer">
          <h1 className="Form__titulo">Joshtagram</h1>
          <p className="FormContainer__info">
            Regístrate para que veas el clon de Instagram
          </p>
          <form onSubmit={handleSubmit}>{/* cuando el formulario sea enviado (onSubmit) llamara a la función handleSubmit */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="Form__field"
              required
              onChange={handleInputChange}//llamada a la funcion para aplicar lo que hay declarado en ella mas arriba
              value={usuario.email}//utilizamos la funcion usuario con el usestate cogiendo lo que aqui se escribe
            />
            <input
              type="text"
              name="nombre"
              placeholder="Nombre y Apellido"
              className="Form__field"
              required
              minLength="3"
              maxLength="100"
              onChange={handleInputChange}//llamada a la funcion para aplicar lo que hay declarado en ella mas arriba
              value={usuario.nombre}//utilizamos la funcion usuario con el usestate cogiendo lo que aqui e escribe
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="Form__field"
              required
              minLength="3"
              maxLength="30"
              onChange={handleInputChange}//llamada a la funcion para aplicar lo que hay declarado en ella mas arriba
              value={usuario.username}//utilizamos la funcion usuario con el usestate cogiendo lo que aqui e escribe
            />
            <input
              type="text"
              name="bio"
              placeholder="Cuéntanos de ti..."
              className="Form__field"
              required
              maxLength="150"
              onChange={handleInputChange}//llamada a la funcion para aplicar lo que hay declarado en ella mas arriba
              value={usuario.bio}//utilizamos la funcion usuario con el usestate cogiendo lo que aqui e escribe
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              className="Form__field"
              required
              onChange={handleInputChange}//llamada a la funcion para aplicar lo que hay declarado en ella mas arriba
              value={usuario.password}//utilizamos la funcion usuario con el usestate cogiendo lo que aqui e escribe
            />
            <button className="Form__submit" type="submit">
              Sign up
            </button>
            <p className="FormContainer__info">
              Ya tienes cuenta? <Link to="/login">Login</Link>{/* usamos la carectarestica especial link para que la pagina no refresque al cambiar de vista */}
            </p>
          </form>
        </div>
      </div>
    </Main>
  );
}