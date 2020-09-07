import Axios from 'axios';

export default async function toggleSiguiendo(usuario) {//funcion para seguir usuarios
  let usuarioActualizado;

  if (usuario.siguiendo) {//si yo estoy siguiendo al usuario
    await Axios.delete(`/api/amistades/${usuario._id}/eliminar`);//hacemos un delete con axios llamando al endpoint del back
    usuarioActualizado = {//actualizamos el usuario
      ...usuario,//con todas sus propiedades identicas
      numSeguidores: usuario.numSeguidores - 1,//excepto el numero de seguidores que seria menos 1
      siguiendo: false//y siguiendo se coloca en falso
    };
  } else {//en caso de que no lo este siguiendo
    await Axios.post(`/api/amistades/${usuario._id}/seguir`);//hacemos un post al endpoint del back para seguirlo
    usuarioActualizado = {//actualizamos el usuario
      ...usuario,//con todas sus propiedades
      numSeguidores: usuario.numSeguidores + 1,//y aumentamos en uno el numero de seguidores
      siguiendo: true//y le decimos que siguiendo a ese usuario es true
    };
  }

  return usuarioActualizado;
}
