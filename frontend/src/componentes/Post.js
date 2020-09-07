import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import BotonLike from './BotonLike';
import Comentar from './Comentar';
import { toggleLike, comentar } from '../Helpers/post-helpers'; //importamos la funcion toggleLike

export default function Post({ post, actualizarPost, mostrarError, usuario }) {
  const {
    numLikes,
    numComentarios,
    comentarios,
    _id,
    caption,
    url,
    usuario: usuarioDelPost,
    estaLike
  } = post;
  const [enviandoLike, setEnviandoLike] = useState(false);//declaramos un usestate para saber que a principio no se a enviado like 

  async function onSubmitLike() {
    if (enviandoLike) {//si estamos enviando like
      return;//lo retornamos si mas
    }

    try {
      setEnviandoLike(true);//estamos empezando a enviar un like
      const postActualizado = await toggleLike(post); //utilizamos la funcion togglelike y le pasamos el post y lo guardamos en una variable
      actualizarPost(post, postActualizado);//con esta sentencia remplazamos el post por el actualizadp
      setEnviandoLike(false);//y en este punto enviando like estaria en false porque y a hemos terminado
    } catch (error) {
      setEnviandoLike(false);
      mostrarError('Hubo un problema modificando el like. Intenta de nuevo.');
      console.log(error);
    }
  }

  async function onSubmitComentario(mensaje) { //funcionpara envio de mensaje del post
    const postActualizado = await comentar(post, mensaje, usuario);//donde a comentar le pasamos las prop del parentesis y lo guardamos dento de una variable
    actualizarPost(post, postActualizado);//y la orden para actualizar el post que utilizamos tambien con el boton line
  }

  return (
    <div className="Post-Componente">
      <Avatar usuario={usuarioDelPost} />
      <img src={url} alt={caption} className="Post-Componente__img" />

      <div className="Post-Componente__acciones">
        <div className="Post-Componente__like-container">
          <BotonLike onSubmitLike={onSubmitLike} like={estaLike} /> {/* y aqui le pasamos la funcion onSubmitLike cada vez que se aprete el boton */}
        </div>
        <p>Liked por {numLikes} personas</p>
        <ul>
          <li>
            <Link to={`/perfil/${usuarioDelPost.username}`}>
              <b>{usuarioDelPost.username}</b>
            </Link>{' '}
            {caption}
          </li>
          <VerTodosLosComentarios _id={_id} numComentarios={numComentarios} />
          <Comentarios comentarios={comentarios} />
        </ul>
      </div>
      <Comentar onSubmitComentario={onSubmitComentario} /> {/* pintamos el componente comentar y le pasamos su prop de la funcion que hemos creado arriba */}
    </div>
  );
}

function VerTodosLosComentarios({ _id, numComentarios }) {
  if (numComentarios < 4) {
    return null;
  }

  return (
    <li className="text-grey-dark">
      <Link to={`/post/${_id}`}>Ver los {numComentarios} comentarios</Link>
    </li>
  );
}

function Comentarios({ comentarios }) {
  if (comentarios.length === 0) {
    return null;
  }

  return comentarios.map(comentario => {
    return (
      <li key={comentario._id}>
        <Link to={`/perfil/${comentario.usuario.username}`}>
          <b>{comentario.usuario.username}</b>
        </Link>{' '}
        {comentario.mensaje}
      </li>
    );
  });
}
