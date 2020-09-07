import React from 'react';
import { Link } from 'react-router-dom';

export default function Grid({ posts }) {//exportamos nuestro grid que muestra nuestros posts
  const columnas = posts.reduce((columnas, post) => {//variable para reducir arrays con el fin de mostrar tres en linea
    const ultimaColumna = columnas[columnas.length - 1];//esto nos da la ultima columna

    if (ultimaColumna && ultimaColumna.length < 3) {//si la ultima columna exista y tiene menos de tres elementos
      ultimaColumna.push(post);//le metemos un post
    } else {//y si no
      columnas.push([post]);//le inyectamos una nueva columna que bascamente es un array
    }

    return columnas;//retornamos la columnas con sus posts dentro
  }, []);//el estado inicial de reduce es vacio que lo vamos a ir llenando segun los posts que haya

  return (
    <div>
      {columnas.map((columna, index) => {//hacemos el mapeo iterando por las columnas
        return (//y las devolvemos
          <div key={index} className="Grid__row">
            {columna.map(post => (//mapeo de los post dentro de cada columna
              <GridFoto key={post._id} {...post} />//retornamos el componente de abajo y esparcimos sus propiedades
            ))}
          </div>
        );
      })}
    </div>
  );
}

function GridFoto({ _id, url, caption }) {//componente grid foto con sus props
  return (
    <Link to={`/post/${_id}`} className="Grid__post"> {/* retorna el link que apunta al link del post */}
      <img src={url} alt={caption} className="Grid__post-img" />
    </Link>
  );
}
