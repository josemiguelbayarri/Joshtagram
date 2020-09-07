import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import Main from '../Componentes/Main';
import Loading from '../Componentes/Loading';
import Post from '../Componentes/Post';//importamos el componente post con todas las caracteristicas que hemos definido

async function cargarPosts(fechaDelUltimoPost) {
  const query = fechaDelUltimoPost ? `?fecha=${fechaDelUltimoPost}` : ''; //en caso de que exista una fecha nos pasa la fecha y en cambio de que no en blanco
  const { data: nuevosPosts } = await Axios.get(`/api/posts/feed${query}`); //cambiamos el nombre de data por nuevos post con la desestructuracion y hacemos la llamada aal endpoint del backend

  return nuevosPosts;//devolvemos los nuevos posts
}

const NUMERO_DE_POSTS_POR_LLAMADA = 3;//global para saber que los numeros de post por llamada son tres

export default function Feed({ mostrarError, usuario }) {//le pasamos los props que necesitamos
  const [posts, setPosts] = useState([]);//los posts empiezan en un array vacio hasta que el setpost trae los nuevosposts si cumple elawait
  const [cargandoPostIniciales, setCargandoPostIniciales] = useState(true);//siempre que se abra el feed debe estar en true porque quereos cargar los iniciales
  const [cargandoMasPosts, setCargandoMasPosts] = useState(false);//creamos este estado que empieza en false cuadno se inicia la pagina
  const [todosLosPostsCargados, setTodosLosPostsCargados] = useState(false);//creamos un estado de todos los post cargados para manipularlo abajo

  useEffect(() => {//creamos un efecto
    async function cargarPostsIniciales() {//funcion para cargar los ultimos posts
      try {
        const nuevosPosts = await cargarPosts();// esperamos a que nuevos posts cargue
        setPosts(nuevosPosts);//setposts trae los nuevosPosts
        console.log(nuevosPosts);
        setCargandoPostIniciales(false);//una vez llegados aqui lo ponemos en false porque ya cargamos los iniciales
        revisarSiHayMasPosts(nuevosPosts);//revisar si hay menos de tres post
      } catch (error) {
        mostrarError('Hubo un problema cargando tu feed.');//en caso de que falle mostramos este error
        console.log(error);
      }
    }

    cargarPostsIniciales();
  }, []);//solo se hace una sola vez

  function actualizarPost(postOriginal, postActualizado) {//le pasamos dos parametros el psot original y la version actualizada
    setPosts(posts => {
      const postsActualizados = posts.map(post => {//hacemos un mapeo de los post
        if (post !== postOriginal) {//si el post es diferente al original
          return post;//retornamos el post
        }

        return postActualizado;//retornamos el post actualizado
      });
      return postsActualizados;//retornamos los post actualizados
    });
  }

  async function cargarMasPosts() { //funcion para el boton ver mas
    if (cargandoMasPosts) { //si estamos cargando mas post retornamos para no estar recargando sin parar
      return;//y lo retornamos
    }

    try {
      setCargandoMasPosts(true);//lo ponemos en true porque los estamos cargando
      const fechaDelUltimoPost = posts[posts.length - 1].fecha_creado;//accedemos a la ultima posicino de la lista de post y accedemos a la propiedad de la fecha en la que fue creado y lo guardamos en una variable
      const nuevosPosts = await cargarPosts(fechaDelUltimoPost);//y los nuevos post reciben el ultimo y lo carga en post
      setPosts(viejosPosts => [...viejosPosts, ...nuevosPosts]);//construimos un array con los viejos y los nuevos posts
      setCargandoMasPosts(false);//y ya no seguimos cargando
      revisarSiHayMasPosts(nuevosPosts);
    } catch (error) {
      mostrarError('Hubo un problema cargando los siguientes posts.');
      setCargandoMasPosts(false);
    }
  }

  function revisarSiHayMasPosts(nuevosPosts) { //recibe la lista de nuevos post que se acaban de cargar
    if (nuevosPosts.length < NUMERO_DE_POSTS_POR_LLAMADA) {//si el numero de los nuevos post en menor que tres
      setTodosLosPostsCargados(true);//todos los post ya estan cargados
    }
  }

  if (cargandoPostIniciales) {//si estoy cargando los post iniciales pinto el loading, el spiner para que parezca que esta cargando
    return (
      <Main center>
        <Loading />
      </Main>
    );
  }

  if (!cargandoPostIniciales && posts.length === 0) { //si termine de cargar los post iniciales y el tamaño de post es igual a cero
    return (//devolvemos la vista no sigues a nadie
      <Main center>
        <NoSiguesANadie />
      </Main>
    );
  }

  return (
    <Main center>
      <div className="Feed">
        {posts.map(post => (
          <Post
            key={post._id}//le damos un key al id unico de post cuando lo mapeamos
            post={post}
            actualizarPost={actualizarPost}//le pasamos la funcion que hemos creado
            mostrarError={mostrarError}//le pasamos mostrar error por si algo sale mal
            usuario={usuario}
          />
        ))}
        <CargarMasPosts //pintamos el componente
          onClick={cargarMasPosts} //y ejecutamos la funcion para cargarlos
          todosLosPostsCargados={todosLosPostsCargados} //y le pasamos por aqui la funcion de saber si hay o no mas post
        />
      </div>
    </Main>
  );
}

function NoSiguesANadie() { //funcion de la vista que se ve en el feed si no sigues a nadie o nadie a posteado nada
  return (
    <div className="NoSiguesANadie">
      <p className="NoSiguesANadie__mensaje">
        Tu feed no tiene fotos porque no sigues a nadie, o porque no han
        publicado fotos.
      </p>
      <div className="text-center">
        <Link to="/explore" className="NoSiguesANadie__boton">
          Explora Joshtagram
        </Link>
      </div>
    </div>
  );
}

function CargarMasPosts({ onClick, todosLosPostsCargados }) {//funcion para cargar mas post y mostrar la vista
  if (todosLosPostsCargados) { //si todos los post estan cargado
    return <div className="Feed__no-hay-mas-posts">No hay más posts</div>; /* mostramos esta vista */
  }

  return ( /* y si no mostramos el boton ver mas */
    <button className="Feed__cargar-mas" onClick={onClick}>
      Ver más
    </button>
  );
}