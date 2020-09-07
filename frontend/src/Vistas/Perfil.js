import React, { useState, useEffect } from 'react';
import Main from '../Componentes/Main';
import Loading from '../Componentes/Loading';
import Grid from '../Componentes/Grid';
import RecursoNoExiste from '../Componentes/RecursoNoExiste';
import Axios from 'axios';
import stringToColor from 'string-to-color';
import toggleSiguiendo from '../Helpers/amistad-helpers';
import useEsMobil from '../Hooks/useEsMobil';//importamos el helper par vista en mobil

export default function Perfil({ mostrarError, usuario, match, logout }) {
  const username = match.params.username;//el usuario seadquiere mediante match y los parametros que se inyecten
  const [usuarioDueñoDelPerfil, setUsuarioDueñoDelPerfil] = useState(null);//la informacion de este estado corrsponde al dueño del perfil
  const [posts, setPosts] = useState([]);//para cargar los posts del usuario con array en blanco para que se llene
  const [cargandoPerfil, setCargandoPefil] = useState(true);//cargano perfil en true porque cuando hace render por primera vez se carga la data
  const [perfilNoExiste, setPerfilNoExiste] = useState(false);//estado para cargar en casa de que no exista en falso hasta que nos retorne la data
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [enviandoAmistad, setEnviandoAmistad] = useState(false);
  const esMobil = useEsMobil();//cargamos la funcion para los media querie de movil

  useEffect(() => {//funcion en linea 
    async function cargarPostsYUsuario() {//se llama asi porque carga ambas cosas
      try {
        setCargandoPefil(true);//el perfil siempre se esta cargando cuando se requiera
        const { data: usuario } = await Axios.get(`/api/usuarios/${username}`);//llamada al endpoint del back con la data usuario para traerlo
        const { data: posts } = await Axios.get(
          `/api/posts/usuario/${usuario._id}`//llamada al endpoint del back con la data post para traerlos
        );
        setUsuarioDueñoDelPerfil(usuario);//se actualiza el usuario al del perfil al que entramos
        setPosts(posts);//y sus posts correspondientes
        setCargandoPefil(false);//y se deja de cargar el perfil porque a esta altura ya esta hecho
      } catch (error) {//nuestro error en caso de que falle algo
        if (//si pasa l siguiente...
          error.response &&
          (error.response.status === 404 || error.response.status === 400)//si pasan estos errores
        ) {
          setPerfilNoExiste(true);//el perfil del usuario no existe
        } else {//y en caso de que no le pasmos un mensaje de error generico
          mostrarError('Hubo un problema cargando este perfil.');
        }
        setCargandoPefil(false);//y dejaria de cargar el perfil
      }
    }

    cargarPostsYUsuario();//se activa la funcion que acabamos de crear
  }, [username]);//se ejecuta cada vez que elegimos a un usuario distinto, por eso le pasamos username 

  function esElPerfilDeLaPersonaLogin() {//esta funcion se usa para entrar al perfil de la persona que se encuentra logueada en la aplicacion
    return usuario._id === usuarioDueñoDelPerfil._id;//retornamos que cuando el id del usuario sea exactamente igual al del logueado
  }

  async function handleImagenSeleccionada(event) {//funcion que os permite subir una imagen al avatar
    try {
      setSubiendoImagen(true);//ponemos en true el subiendo imagen
      const file = event.target.files[0]; //seleccionamos el archivo que vamos a subir con l posicion 0 porque solo podemos subir uno
      const config = {//configuracion para axios
        headers: {
          'Content-Type': file.type //con esta configuracion el servidor va a leer el tipo de archivo que estamos subiendo
        }
      };
      const { data } = await Axios.post('/api/usuarios/upload', file, config);//enviamos un post al endpoint del back con el archivo y la configuracion
      setUsuarioDueñoDelPerfil({ ...usuarioDueñoDelPerfil, imagen: data.url });//llamamos a la funcion que actualiza el perfil del usuario esparcimos sus props y la nueva imagen de avatar
      setSubiendoImagen(false);//dejamos de subir la imagen
    } catch (error) {//le pasamos un error en caso de que algo falle
      mostrarError(error.response.data);//error que recuperamos de la consola
      setSubiendoImagen(false);//dejamos de subir la imagen
      console.log(error);
    }
  }

  async function onToggleSiguiendo() {
    if (enviandoAmistad) {
      return;
    }

    try {
      setEnviandoAmistad(true);//enviamos la amistad
      const usuarioActualizado = await toggleSiguiendo(usuarioDueñoDelPerfil);//y el usuario actualizado es igual al usuario que es dueño del perfil y construimos una relacion estre los dos usuarios
      setUsuarioDueñoDelPerfil(usuarioActualizado);//actualizamos el usuario dueño de perfil
      setEnviandoAmistad(false);//dejamos de enviar la peticion de amistad
    } catch (error) {//en caso de que haya un error le pasamos un mensaje
      mostrarError(
        'Hubo un problema siguiendo/dejando de seguir a este usuario. Intenta de nuevo'
      );
      setEnviandoAmistad(false);//en este punto dejamos de enviar el mensaje
      console.log(error);
    }
  }

  if (cargandoPerfil) {//añadimos el loading para que inicie cargando cuando se haga el render por pirmera vez
    return (
      <Main center>
        <Loading />
      </Main>
    );
  }

  if (perfilNoExiste) {//si el perfil no existe le pasamos el componente recursonoEiste con un mensaje de error
    return (
      <RecursoNoExiste mensaje="El perfil que estas intentando ver no existe" />
    );
  }

  if (usuario == null) {//y si el usuario es null por un error en el servidor o algo asi
    return null;//devolvemos null
  }

  return (
    <Main>
      <div className="Perfil">
        <ImagenAvatar
          esElPerfilDeLaPersonaLogin={esElPerfilDeLaPersonaLogin()}
          usuarioDueñoDelPerfil={usuarioDueñoDelPerfil}
          handleImagenSeleccionada={handleImagenSeleccionada}
          subiendoImagen={subiendoImagen}
        />
        <div className="Perfil__bio-container">
          <div className="Perfil__bio-heading">
            <h2 className="capitalize">{usuarioDueñoDelPerfil.username}</h2>
            {!esElPerfilDeLaPersonaLogin() && ( //si yo no estoy en mi perfil mientras me encuentro login muestro el boton de seguir 
              <BotonSeguir
                siguiendo={usuarioDueñoDelPerfil.siguiendo}
                toggleSiguiendo={onToggleSiguiendo}
              />
            )} {/* en caso de que si sea mi perfil muestro logout para salir de  mi sesion */}
            {esElPerfilDeLaPersonaLogin() && <BotonLogout logout={logout} />}
          </div>
          {!esMobil && (//si no es movil retornamos lo de arriba
            <DescripcionPerfil usuarioDueñoDelPerfil={usuarioDueñoDelPerfil} />
          )}
        </div>
      </div>
      {esMobil && (//si es movil retornamos lo de abajo
        <DescripcionPerfil usuarioDueñoDelPerfil={usuarioDueñoDelPerfil} /> /* y aqui redereamos la descripcion de perfil que esta en la funcion de abajo */
      )}

      <div className="Perfil__separador" />
      {posts.length > 0 ? <Grid posts={posts} /> : <NoHaPosteadoFotos />} {/* si el tamaño de los post de este usuario es mayor que cero reutilizamos el grid aqui dentro */}
    </Main>
  );
}

function DescripcionPerfil({ usuarioDueñoDelPerfil }) {//la descripcion del perfil donde aparece toda la info del usuario qal que pertenece ese perfil
  return (
    <div className="Perfil__descripcion">
      <h2 className="Perfil__nombre">{usuarioDueñoDelPerfil.nombre}</h2>
      <p>{usuarioDueñoDelPerfil.bio}</p>
      <p className="Perfil__estadisticas">
        <b>{usuarioDueñoDelPerfil.numSiguiendo}</b> following
        <span className="ml-4">
          <b>{usuarioDueñoDelPerfil.numSeguidores}</b> followers
        </span>
      </p>
    </div>
  );
}

function ImagenAvatar({//componente para la imagen de avatar del perfil con sus props
  esElPerfilDeLaPersonaLogin,
  usuarioDueñoDelPerfil,
  handleImagenSeleccionada,
  subiendoImagen
}) {
  let contenido;//variable contenido para luego retornarla

  if (subiendoImagen) {//si estamos subiendo la imagen
    contenido = <Loading />;//el contenido es igual al compenente del loading
  } else if (esElPerfilDeLaPersonaLogin) {//si estamos viendo el perfil de la persona logueada
    contenido = ( //le pasamos la siguiente vista
      <label
        className="Perfil__img-placeholder Perfil__img-placeholder--pointer"
        style={{//le damos los siguientes estilos
          backgroundImage: usuarioDueñoDelPerfil.imagen
            ? `url(${usuarioDueñoDelPerfil.imagen})`//en caso de que el usuario haya subido una imagen la ponemos
            : null,//en caso de que no le damos null
          backgroundColor: stringToColor(usuarioDueñoDelPerfil.username)//en caso de que no haya foto usamos esta funcion para generar colores aleatorios
        }}
      >
        <input //este input lo usamos para subir una imagen del ordenador para nuestro perfil de avatar
          type="file"
          onChange={handleImagenSeleccionada}
          className="hidden"
          name="imagen"
        />
      </label>
    );
  } else {//en caso de que no sea de la persona logueada
    contenido = (//le pasamos los mimos parametros de arriba para la imagen en caso de que haya o de que no
      <div
        className="Perfil__img-placeholder"
        style={{
          backgroundImage: usuarioDueñoDelPerfil.imagen
            ? `url(${usuarioDueñoDelPerfil.imagen})`//en caso de que haya
            : null,//en caso de que no
          backgroundColor: stringToColor(usuarioDueñoDelPerfil.username)//funcion para el color aleatorio
        }}
      />
    );
  }

  return <div className="Perfil__img-container">{contenido}</div>;
}

function BotonSeguir({ siguiendo, toggleSiguiendo }) {//funcion de boton seguir con sus props
  return (
    <button onClick={toggleSiguiendo} className="Perfil__boton-seguir"> {/* le pasamos la funcion toggleSiguiendo para que cuando se haga onclick se ejecute */}
      {siguiendo ? 'Dejar de seguir' : 'Seguir'} {/* revisamos si estamos siguoendo o si no y deoende de nuestro estado se muestra un menssaje u otro */}
    </button>
  );
}

function BotonLogout({ logout }) {
  return (
    <button className="Perfil__boton-logout" onClick={logout}> {/* le pasamos la funcion logout en el onclick para que se ejecute la funcion */}
      Logout
    </button>
  );
}

function NoHaPosteadoFotos() {
  return <p className="text-center">Este usuario no ha poteado fotos.</p>;
}
