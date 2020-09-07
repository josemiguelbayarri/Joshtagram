import { useState, useEffect } from 'react';

export default function useEsMobil() {//funcion para identificar si estamos en un movil o no
  const [esMobil, setEsMobil] = useState(null);//creamos el estado y lo dejamos en null de entrada

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 576px)');//creamos el media querie y lo guardamos en una variable

    mql.addListener(revisarSiEsMobil);//cada vez que la pantalla cambia de tamaño se revisa

    function revisarSiEsMobil() {//funcion para comprobar el tamaño de la pantalla
      if (mql.matches) {//si es verdadero
        setEsMobil(false);//no es mobil
      } else {//en caso de lo contrario
        setEsMobil(true);//si es movil
      }
    }

    revisarSiEsMobil();//activamos la funcion

    return () => mql.removeListener(revisarSiEsMobil);//con esto limpiamos el media querie cuando ya detecte que es movil
  }, []);//lo ejecutamos una sola vez

  return esMobil;//retorna este estado para poder consumirlo en nuestro componente
}
