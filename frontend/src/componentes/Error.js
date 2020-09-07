import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';//activamos la libreria de iconos 
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';//para luego importar el icono que queremos mostrar

export default function Error({ mensaje, esconderError }) {//le pasamos las propiedades mensaje y esconder error
  if (!mensaje) {//si no hay un mensaje 
    return null;//simplemente retornamos null y no mostramos el mensaje
  }

  return (//en caso de que si retornamo la vista que a continuacion creamos para que se muestre visualmente
    <div className="ErrorContainer" role="alert">
      <div className="Error__inner">
        <span className="block">{mensaje}</span> {/* interpolamos el mensaje para que e muestre dentro de esta estructura */}
        <button className="Error__button" onClick={esconderError}>{/* cuando demos click se llama a la funcion esconder error */}
          <FontAwesomeIcon className="Error__icon" icon={faTimesCircle} />{/* importamos el icono que llamamos arriba para que se muestre */}
        </button>
      </div>
    </div>
  );
}
