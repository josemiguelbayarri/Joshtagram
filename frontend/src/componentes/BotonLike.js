import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as heartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as heartSolid } from '@fortawesome/free-solid-svg-icons';

export default function BotonLike({ onSubmitLike, like }) {//nuestro componenete recibe las dos propiedades ne usaremos dentro
  return (
    <button onClick={onSubmitLike}> {/* cuando se le de onclick se llamara a la funcion onSubmitLike */}
      {like ? ( /* operacion ternaria, si like es verdadero llamaremos al icono con el corazon pintado */
        <FontAwesomeIcon className="text-red-dark" icon={heartSolid} />
      ) : ( /* y si no llamaremos al corazon con el interior transparente */
        <FontAwesomeIcon icon={heartRegular} />
      )}
    </button>
  );
}