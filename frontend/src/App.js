import React, { useState, useEffect } from 'react';//usestate nos permite declarar estados en componentes donde se importe,,, Useeffect nos perite ejecutar codigo luego de que un componente a sido rendereado
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';//libreria para generar funcionalidades de rutas para las vistas de react
import Axios from 'axios';//libreria axios para el control de rutas

import {
  setToken,//importamos settoken 
  deleteToken,//importamos deletetoken
  getToken,
  initAxiosInterceptors
} from './Helpers/auth-helpers';
import Nav from './Componentes/Nav'; //importamos el componente nav
import Loading from './Componentes/Loading';//importamos el componente loading
import Error from './Componentes/Error';

import Signup from './Vistas/Signup';
import Login from './Vistas/Login';
import Upload from './Vistas/Upload';
import Feed from './Vistas/Feed';
import Post from './Vistas/Post';
import Explore from './Vistas/Explore';
import Perfil from './Vistas/Perfil';
import Main from './Componentes/Main';

initAxiosInterceptors();//llamamos al interceptor para que sea parte de la llamado de usuario

export default function App() {
  const [usuario, setUsuario] = useState(null); // no sabemos si hay un usuario autenticado
  const [cargandoUsuario, setCargandoUsuario] = useState(true);//booleano para saber si hay un usuario utenticdo o no
  const [error, setError] = useState(null);//tercer estado que contiene un error y la funcion seterror para poder manipular este estado y empieza en null porue por defecto no hay ningun error

  useEffect(() => {//la funcion useEffect se ejecute despues de que el componente haga render
    async function cargarUsuario() {//hacemos la funcion asincrona aqui dentro porue fuera no se puede
      if (!getToken()) {//si no existe un token
        setCargandoUsuario(false);//no se puede cargar el usuario insertado en localstorage porque no hay
        return;//y lo retornamos
      }

      try {
        const { data: usuario } = await Axios.get('/api/usuarios/whoami');//si la llamada es exitosa el servidor nos retorna un usuario que en laza con el endpoint del backend
        setUsuario(usuario);//actualizamos la informacion de usuario
        setCargandoUsuario(false);//cambiamos a false porque ya no tenemos que seguir cargando al usuario
      } catch (error) {
        console.log(error);//en caso de que haya un error
      }
    }

    cargarUsuario();//esta se carga en bucle todo el rato sin parar cosa que no nos interesa
  }, []);// por eso le pasamos este array en blanco para que solo corra el metodo useEffect una vez

  async function login(email, password) {//la funcion login le pasamos el email y el password
    const { data } = await Axios.post('/api/usuarios/login', {//le pasamos el endpoint con el backend cpar el login
      email,
      password
    });
    setUsuario(data.usuario);//guardamos el usuario
    setToken(data.token);// y el token que el usuario nos envio una vez hizo la autentificacion preservandolo aunque el usuario refresque la pagina
  }

  async function signup(usuario) {//la funcion signup recive todas las carecteristicas de su formulario con el objeto usuario dentro del parentesis
    const { data } = await Axios.post('/api/usuarios/signup', usuario);//le pasamos por axios la ruta del endpoint con el backned
    setUsuario(data.usuario);//le pasamos el usuarioo
    setToken(data.token);//y el token
  }

  function logout() {//funcion para desloguearnos
    setUsuario(null);//devolvemos el usuario a null
    deleteToken();//borraos el token de localstorage
  }

  function mostrarError(mensaje) {//funcion para mostrar el error
    setError(mensaje);//le metemos el error y mostramos el mensaje
  }

  function esconderError() {//funcion para esnconder error
    setError(null);//para qeu el mostrar error desaparezca
  }

  if (cargandoUsuario) {//si estamos cargando un usuario, retornamos el componente loadin para renderearlo
    return (
      <Main center>
        <Loading />
      </Main>
    );
  }

  return (
    <Router>{/* envolvemos toda nuestra aplicacion en la etiqueta router */}
      <Nav usuario={usuario} />
      <Error mensaje={error} esconderError={esconderError} />
      {usuario ? ( //generamos un condicional y decimos que si tenemos un usuario logueado mostramos las loginroutes
        <LoginRoutes
          mostrarError={mostrarError}
          usuario={usuario}
          logout={logout}
        />
      ) : ( //y si no tenemos al usuario logueado mostramos las rutas logoutRoutes
        <LogoutRoutes  /* mostramos las rutas logout y le pasammos sus dos metodos, login, signup y mostrar error */
          login={login}
          signup={signup}
          mostrarError={mostrarError}
        />
      )}
    </Router>
  );
}

function LoginRoutes({ mostrarError, usuario, logout }) {//componente responsable de las rutas una vez que el usuario este autenticado y le pasamos las propiedades que usaremos en ellas
  return (
    <Switch>
      <Route //esta ruta solo es accesible si el usuario esta logueado
        path="/upload" //slash en el que se mostrara esta ruta
        render={props => <Upload {...props} mostrarError={mostrarError} />}//la propiedad mostrar error puede ser usada en esta ruta
      />
      <Route
        path="/post/:id" /* la ruta de cada post individual cogiendo su id unico */
        render={props => (
          <Post {...props} mostrarError={mostrarError} usuario={usuario} />//la propiedad mostrar error puede ser usada en esta ruta
        )}
      />
      <Route
        path="/perfil/:username"
        render={props => (
          <Perfil
            {...props}
            mostrarError={mostrarError}//la propiedad mostrar error puede ser usada en esta ruta
            usuario={usuario}
            logout={logout}
          />
        )}
      />
      <Route
        path="/explore"
        render={props => <Explore {...props} mostrarError={mostrarError} />}//la propiedad mostrar error puede ser usada en esta ruta
      />
      <Route //ruta del feed que se muestra por defecto cuando el usuario esta logueado
        path="/"
        render={props => (
          <Feed {...props} mostrarError={mostrarError} usuario={usuario} />//la propiedad mostrar error puede ser usada en esta ruta
        )}
        default
      />
    </Switch>
  );
}

function LogoutRoutes({ login, signup, mostrarError }) {//este componente es responsable de mostrar las rutas que el usuario puede acceder cuando no esta autenticado
  return (
    <Switch>{/* envolvemos nuestras rutas con switch */}
      <Route
        path="/login/"/* la ruta login se activa al estar en slash login */
        render={props => (/* usamos render porque nuestra ruta login tiene un prop */
          <Login {...props} login={login} mostrarError={mostrarError} />/* mostramos nuestro componente login le esparcemos las propiedades que trae y le pasamos las que queremos que tenga */
        )}
      />
      <Route /* no le damos un path a signup porque es nuestro commponente por defecto por eso le pasamos el default */
        render={props => (
          <Signup {...props} signup={signup} mostrarError={mostrarError} />/* mostramos nuestro componente signup esparcimos sus props y le pasammos las propiedades que nos interese */
        )}
        default /* con esta sentencia declaramos que signup es nuestra ruta por defecto principal */
      />
    </Switch>
  );
}
