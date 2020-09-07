import React, { useState, useEffect } from 'react';
import Main from '../Componentes/Main';
import Loading from '../Componentes/Loading';
import Avatar from '../Componentes/Avatar';
import Comentar from '../Componentes/Comentar';
import BotonLike from '../Componentes/BotonLike';
import RecursoNoExiste from '../Componentes/RecursoNoExiste';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import { toggleLike, comentar } from '../Helpers/post-helpers';

export default function PostVista({ mostrarError, match, usuario }) {//le pasamos nuestras props a nuestro post individual
  const postId = match.params.id; //contiene el id del post que se inyecta por los parametros que se encuentran en el url
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postNoExiste, setPostNoExiste] = useState(false);//estado de post no existente
  const [enviandoLike, setEnviandoLike] = useState(false);//estado para enviar like que enpieza en falso

  useEffect(() => {
    async function cargarPost() {//creamos el async aqui dentro porque useefect no lo tolera
      try {
        const { data: post } = await Axios.get(`/api/posts/${postId}`); //cogemos del endpoint del back la data del post por su id
        setPost(post);//isertamos el post
        setLoading(false);//terminamos de cargar a estas alturas y lo poemos en false
      } catch (error) {
        if ( //si hubo una respuesta de error igual a 404 o 400
          error.response &&
          (error.response.status === 404 || error.response.status === 400)
        ) {
          setPostNoExiste(true); //nos manda una resouesta en true de que el post no existe
        } else { //en caso de que el error haya sido distinto mandamos un mensaje habitual de error
          mostrarError('Hubo un problema cargando este post.');
        }
        setLoading(false);// aqui terminamos de cargar el loading
      }
    }

    cargarPost();//activamos la funcion para cargar el post
  }, [postId]);//y con esto lo activamos solo una vez con la dependencia del id del post por lo que si el id cambia carga de nuevo

  async function onSubmitComentario(mensaje) {//funcion para enviar comentarios en la vista individual de cada post
    const postActualizado = await comentar(post, mensaje, usuario);
    setPost(postActualizado);//con esto ya traemos el comentario actualizado del post
  }

  async function onSubmitLike() {//funcion para enviar likes en la vista individual de cada post
    if (enviandoLike) {//si se esta enviandon el comentario
      return;//retornamos
    }

    try {
      setEnviandoLike(true);//enviando el comentario es true porque esta pasando
      const postActualizado = await toggleLike(post);//porteamos el cambio del like y lo guardamos en la funcion postActualizado
      setPost(postActualizado); //insertamos al post el postActualizado
      setEnviandoLike(false);//le decimos que deje de enviar el like porque ya se ha actualizado
    } catch (error) {//en caso de ue falle le pasmos el error
      setEnviandoLike(false);//le decimos que el envio de like es falso
      mostrarError('Hubo un problema modificando el like. Intenta de nuevo.');//y le pasamos un mensaje de error
      console.log(error);
    }
  }

  if (loading) { //si esta cargando retornamos el componente loading
    return (
      <Main center>
        <Loading />
      </Main>
    );
  }

  if (postNoExiste) { //si el post no existe se muestra el comnente de recurso no existe con su mensaje que le pasamos por abajo
    return (
      <RecursoNoExiste mensaje="El post que estas intentando ver no existe" />
    );
  }

  if (post == null) {
    return null;
  }

  return (
    <Main center>
      <Post
        {...post} /* esparcimos todas las propiedades */
        onSubmitComentario={onSubmitComentario} /* con esto nos actualiza los comentarios del post */
        onSubmitLike={onSubmitLike} /* con esto actualizamos los likes de la vista individual del post */
      />
    </Main>
  );
}

function Post({// esta funcion la devolvemos en la linea 83
  comentarios, //estas son las props que esparcimos arriba
  caption,
  url,
  usuario,
  estaLike,
  onSubmitLike,
  onSubmitComentario
}) {
  return (// y esta es la vista que retornamos
    <div className="Post">
      <div className="Post__image-container">
        <img src={url} alt={caption} />
      </div>
      <div className="Post__side-bar">
        <Avatar usuario={usuario} /> {/* le pasamos el avatar del usuario a cada post */}

        <div className="Post__comentarios-y-like">
          <Comentarios /* comentarios que van debajo de cada post hecho por otros usuarios */
            usuario={usuario} /* estas son las props de comentarios */
            caption={caption} /* estas son las props de comentarios */
            comentarios={comentarios} /* estas son las props de comentarios */
          />
          <div className="Post__like">
            <BotonLike onSubmitLike={onSubmitLike} like={estaLike} /> {/* con la propiedad estaLike le pasamos el estado de si esta o no like */}
          </div>
          <Comentar onSubmitComentario={onSubmitComentario} /> {/* le pasamos la etiqueta comentar para que se pinte el componente en esta parte */}
        </div>
      </div>
    </div>
  );
}

function Comentarios({ usuario, caption, comentarios }) { //este componente va a recibir los comentarios
  return (
    <ul className="Post__comentarios">
      <li className="Post__comentario"> {/* vista del nombre del usuario que comenta el post */}
        <Link
          to={`/perfil/${usuario.username}`} /* nombre del usuario y redireccion a su perfil */
          className="Post__autor-comentario"
        >
          <b>{usuario.username}</b> {/* nombre del usuario interpolado para que se muestre el usuario en cuestion */}
        </Link>{' '} {/* con estas llaves hacemos un espacio entre el nombre del usuario y lo que ha escrito debajo de la foto del post */}
        {caption}
      </li>
      {comentarios.map(comentario => ( //mapeo de los comentario pasandole el parametro comentario y haciendo que pinte la vista de abajo
        <li className="Post__comentario" key={comentario._id}> {/* le pasamos el id del comentario en cuestion */}
          <Link
            to={`/perfil/${comentario.usuario.username}`} /* y la url con el interpolado de comentario unido a su usuario */
            className="Post__autor-comentario"
          >
            <b>{comentario.usuario.username}</b> {/* pintamos el usuario unido a ese comentario */}
          </Link>{' '}
          {comentario.mensaje} {/* pintamos el mensahe del comentario */}
        </li>
      ))}
    </ul>
  );
}
