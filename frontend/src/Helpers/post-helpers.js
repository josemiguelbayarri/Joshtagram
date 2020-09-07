import Axios from 'axios';

export async function toggleLike(post) {//toggle significa cambiar de apagadoa encendido y viceversa
  const url = `/api/posts/${post._id}/likes`; //creamos la variable que contiene donde se hacen las llamadas al like del post
  let postConLikeActualizado; //creamos esta variable para manipularla abajo

  if (post.estaLike) {//si el post esta en like
    await Axios.delete(url, {});//ordenamos que haga un delete a esa url y se quede en blanco
    postConLikeActualizado = {//con la vatriable que hemos creado
      ...post,//pintamos todo igual
      estaLike: false,//excepto el estado que le decimos que ya no esta like
      numLikes: post.numLikes - 1 //y el contador baja en uno
    };
  } else {// por otra lado si no esta en like
    await Axios.post(url, {});//ordenamos que se añada pasandole la url tambien
    postConLikeActualizado = {// y aqui haceos lo mismo
      ...post,//comieamos todos los estados
      estaLike: true,//excepto el estado de like que esta vez lo dejamos en tru
      numLikes: post.numLikes + 1 //y sumamos uno al contador
    };
  }

  return postConLikeActualizado;
}

export async function comentar(post, mensaje, usuario) { //funcion para guardar y actualizar los comentarios de los post con sus propiedades de usuario y mensaje y el post en el que va metudo
  const { data: nuevoComentario } = await Axios.post(
    `/api/posts/${post._id}/comentarios`, //llamada al endpoint del backend para agregar comentarios al post
    { mensaje }
  );
  nuevoComentario.usuario = usuario;//añadimos el usuario al comentario como tal , el usuario logueado claro

  const postConComentariosActualizados = {//funcion de post actualizado con este comentario
    ...post,//copiamos todas las propiuedades tal cual
    comentarios: [...post.comentarios, nuevoComentario],//pero cambiamos la propiedad cometnarios con todos los comentarios que ya tenia mas un nuevo comentario
    numComentarios: post.numComentarios + 1//y aumentamos la cuenta de comentarios
  };

  return postConComentariosActualizados;//y retornamos este post con comentarios actualizados
}