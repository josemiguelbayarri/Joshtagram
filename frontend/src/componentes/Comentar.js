import React, { useState } from 'react';

export default function Comentar({ onSubmitComentario, mostrarError }) { //las propiedades de nuestro componente para envir comentarios a los posts
  const [mensaje, setMensaje] = useState('');
  const [enviandoComentario, setEnviandoComentario] = useState(false);//si estamos enviando un comentario que de entrado es false

  async function onSubmit(e) {
    e.preventDefault(); //para que el navegador no refresque por defecto el componente del formulario

    if (enviandoComentario) {//si estamos enviando un comentario
      return;//que lo retorne
    }

    try {
      setEnviandoComentario(true);//decimos que es verdad que lo estamos enviando
      await onSubmitComentario(mensaje);//le pasamos la funcion de enviar comentario y el mensaje que lleve esa funcion
      setMensaje('');
      setEnviandoComentario(false);//llegados a este punto lo pines en false para no seguir enviandolo
    } catch (error) {//en caso de que falle le pasamos el error
      setEnviandoComentario(false);
      mostrarError(
        'Hubo un problema guardando el comentario. Intenta de nuevo.'
      );
    }
  }

  return ( //retornamos un formulario para enviar comentarios de cada post
    <form className="Post__comentario-form-container" onSubmit={onSubmit}> {/* cuando se haga un onSubmit se llama al metodo del mismo nombre de arriba */}
      <input
        type="text"
        placeholder="Deja un comentario..."
        required
        maxLength="180"
        value={mensaje}
        onChange={e => setMensaje(e.target.value)} /* cuando cambie le pasamos cada valor al formulario */
      />
      <button type="submit">Post</button>
    </form>
  );
}
