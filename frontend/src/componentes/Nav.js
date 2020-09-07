import React from 'react';
import { Link } from 'react-router-dom'; //importamos link para poder crear anclas que no refresquen la pagina
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; //importamo el icono para poder implementarrlp
import { faCameraRetro } from '@fortawesome/free-solid-svg-icons'; //y aqui importamos la camara para poder importarlo y pintarlo
import { faCompass, faUser } from '@fortawesome/free-regular-svg-icons';

export default function Nav({ usuario }) {
  return (
    <nav className="Nav">
      <ul className="Nav__links">
        <li>
          <Link className="Nav__link" to="/">
            Joshtagram
          </Link>
        </li>
        {usuario && <LoginRoutes usuario={usuario} />} {/* si hay un usuario vamos a querer hacer render de una nueva ruta que se llama ruta de login */}
      </ul>
    </nav>
  );
}

function LoginRoutes({ usuario }) { //funcio de las rutas de login del nav
  return (
    <> {/* react fragment o envoltario para no utilizar un div comoo padre porque no nos interesa */}
      <li className="Nav__link-push">
        <Link className="Nav__link" to="/upload"> {/* este link apunta a upload en caso de ue el usuario este logueado */}
          <FontAwesomeIcon icon={faCameraRetro} /> {/* he importamos el icono de la camara */}
        </Link>
      </li>
      <li className="Nav__link-margin-left">
        <Link className="Nav__link" to="/explore">
          <FontAwesomeIcon icon={faCompass} />
        </Link>
      </li>
      <li className="Nav__link-margin-left">
        <Link className="Nav__link" to={`/perfil/${usuario.username}`}>
          <FontAwesomeIcon icon={faUser} />
        </Link>
      </li>
    </>
  );
}
