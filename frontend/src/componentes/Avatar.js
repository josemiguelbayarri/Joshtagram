import React from 'react';
import { Link } from 'react-router-dom';
import stringToColor from 'string-to-color';

export default function Avatar({ usuario }) {
  return (
    <div className="Avatar">
      <ImagenAvatar usuario={usuario} /> {/* le pasamos la imagen definida abajo */}

      <Link to={`/perfil/${usuario.username}`}> {/* el avatar apunta al perfil del usuario */}
        <h2>{usuario.username}</h2>
      </Link>
    </div>
  );
}

export function ImagenAvatar({ usuario }) {//le pasamos la propiedad usuario
  const style = {
    backgroundImagen: usuario.imagen ? `url(${usuario.imagen})` : null,//si el usuario tiene una imagen utiliza la imagen del usuario y si no es asi es null
    backgroundColor: stringToColor(usuario.username)//esta funcion se encarga de mostrar un color aleatorio para avatar de usuario
  };

  return <div className="Avatar__img" style={style} />;//la vista de la imagen de avatar
}