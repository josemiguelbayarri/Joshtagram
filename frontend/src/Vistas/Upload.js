import React, { useState } from 'react';
import Main from '../Componentes/Main';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import Loading from '../Componentes/Loading';
import Axios from 'axios';

export default function Upload({ history, mostrarError }) { //las propiedades necesarias para esta eportacion
  const [imagenUrl, setImagenUrl] = useState('');//declaramos una variable con dos estados en el que el primero es la imagen y el segundo la url que retorna esa imagen y el uestate vacio porque de entrada no hay ninguna imagen
  const [subiendoImagen, setSubiendoImagen] = useState(false);//estado para indicar que se esta subiendo una imagen, el loading por asi decirlo que en un inicio esta en false
  const [enviandoPost, setEnviandoPost] = useState(false);//variable para saber si estamos enviando post de la imagenque empieza en falso
  const [caption, setCaption] = useState('');//guardamos el caption en el estado

  async function handleImagenSeleccionada(evento) { //funcion de la imagen seleccionada que se muestra antes de postearla cuado hacemos un upload
    try {
      setSubiendoImagen(true); //la opcion de setSubiendoImagen es true porque se esta subiendo
      const file = evento.target.files[0]; //con esta variable seleccionamos el file que el usuario selecciono donde target es el file que se mete desde el input de seleccion de imagen

      const config = {
        headers: {
          'Content-Type': file.type //con esta declaracion sabemos la terminacion de la imagen, es decir .png etc...
        }
      };

      const { data } = await Axios.post('/api/posts/upload', file, config); //desestructurdamos data y llamamos al endpoint para subir archivos y les pasamos las variables file y config declaradas arriba
      setImagenUrl(data.url);//la imagen insertada es lo que contiene data mas la url de la imagen
      setSubiendoImagen(false);//llegados a este punto el loading spinner no es necesario y lo pasamos a false
    } catch (error) { // en caso de error
      setSubiendoImagen(false);//no se esta subiendo una imagen
      mostrarError(error.response.data);// le pasamos el error que muestra la data de la consola
      console.log(error);
    }
  }

  async function handleSubmit(evento) {
    evento.preventDefault(); //nosotros nos encargamos de enviar la data y no el navegador por defecto

    if (enviandoPost) { //si estamos enviando post
      return;//lo retornamos
    }

    if (subiendoImagen) {//si la imagen se queda subiendo si llegar a subir
      mostrarError('No se ha terminado de subir la imagen');//mostramos este error para que el usuario lo sepa
      return;//y lo retornamos
    }

    if (!imagenUrl) { //si no tenemos un url de una imagen
      mostrarError('Primero selecciona una imagen');//mostramos este error
      return;// y retornamos
    }

    try {
      setEnviandoPost(true);//en caso de que el post se envie y sea true
      const body = {//le pasamos por el body
        caption,//el caption que escribimos
        url: imagenUrl //y la url de la imagen
      };
      await Axios.post('/api/posts', body);//entonces llamamos al endpoint y le pasamos el cuerpo de la llamada
      setEnviandoPost(false);//y cuando termina ya no estamos enviando ningun post y lo ponemos en false
      history.push('/');//esto nos lleva al home que por estar logueados es el feed
    } catch (error) {
      mostrarError(error.response.data);
    }
  }

  return (
    <Main center>
      <div className="Upload">
        <form onSubmit={handleSubmit}> {/* cuando enviemos el formulario se hace llamada a la funcion handleSubmit */}
          <div className="Upload__image-section">
            <SeccionSubirImagen //pasamos las propiedades que necesitamos para subir la imagen
              imagenUrl={imagenUrl}
              subiendoImagen={subiendoImagen}
              handleImagenSeleccionada={handleImagenSeleccionada} //le pasamos la funcion que hemos creado ariba para meter la imagen en el upload
            />
          </div>
          <textarea
            name="caption"
            className="Upload__caption"
            required
            maxLength="180"
            placeholder="Caption de tu post."
            value={caption}
            onChange={e => setCaption(e.target.value)} /* cuando cambie nuestro caption llamamos a la funcion setcaption */
          />
          <button className="Upload__submit" type="submit">
            Post
          </button>
        </form>
      </div>
    </Main>
  );
}

function SeccionSubirImagen({//funcion subiendo imagen que le pasamos los estados necesarios para su funcionamiento declarados arriba
  subiendoImagen,
  imagenUrl,
  handleImagenSeleccionada
}) {
  if (subiendoImagen) { //si la imagen se esta subiendo
    return <Loading />; //retornamos el loading
  } else if (imagenUrl) { //si no se esta subiendo puede ser que la imagen ya este , le pasamos imagenUrl
    return <img src={imagenUrl} alt="" />; //en este caso devolvemos el url que nos retorna el servidor
  } else {//si no es ninguno de los caso anteriores
    return ( //retornamos la siguiente vista
      <label className="Upload__image-label">
        <FontAwesomeIcon icon={faUpload} /> {/* cargamos un icono conel import de arriba */}
        <span>Publica una foto</span>
        <input //este es el input que necesita el uuario para subir una foto
          type="file"
          className="hidden"
          name="imagen"
          onChange={handleImagenSeleccionada}//la funcion se activa cuando algo cambia en el input
        />
      </label>
    );
  }
}
