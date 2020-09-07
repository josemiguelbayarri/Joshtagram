import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../Componentes/Loading';
import { ImagenAvatar } from '../Componentes/Avatar';
import Axios from 'axios';//libreria para hacer llamadas al servidor
import Main from '../Componentes/Main';
import Grid from '../Componentes/Grid';

export default function Explore({ mostrarError }) {//exportamos nuestra vista y le pasamos los props
  const [posts, setPosts] = useState([]);//creamos este estado con array en blanco inicial
  const [usuarios, setUsuarios] = useState([]);//otro estado con array vacio de usuarios
  const [loading, setLoading] = useState(true);//y el estado loading que empieza en true porque siempre se empieza cargando cuando se hace render

  useEffect(() => {//la funcion asincrona se hace dentro del useEffect para que funcione
    async function cargarPostsYUsuarios() {
      try {
        const [posts, usuarios] = await Promise.all([//recibimos los posts y los usuarios con una promesa
          Axios.get('/api/posts/explore').then(({ data }) => data),//con este endpoint nos traemos los posts
          Axios.get('/api/usuarios/explore').then(({ data }) => data)//y con este los usuarios
        ]);
        setPosts(posts);//actualizamos el estado de nuestro componente
        setUsuarios(usuarios);//actualizamos el estado de nuestro componente
        setLoading(false);//y decimos que setloading es falso
      } catch (error) {//mostramos nuestro clasico error en caso de que algo falle
        mostrarError(
          'Hubo un problema cargando explore. Por favor refresca la página.'
        );
        console.log(error);
      }
    }

    cargarPostsYUsuarios();
  }, []);//sentencia para que solo se ejecute una vez

  if (loading) {//retornamos el loading por si tarda en cargar
    return (
      <Main center>
        <Loading />
      </Main>
    );
  }

  return ( //retornamos la siguiente vista
    <Main>
      <div className="Explore__section">
        <h2 className="Explore__title">Descubrir usuarios</h2>
        <div className="Explore__usuarios-container">
          {usuarios.map(usuario => {//iteramos por cada uno de los usuarios y pintamos cada uno de ellos, como un ngfor de angular
            return (
              <div className="Explore__usuario" key={usuario._id}> {/* la key es vital para hacer un map */}
                <ImagenAvatar usuario={usuario} /> {/* la imagen de avatar con su prop de usuario */}
                <p>{usuario.username}</p> {/* el nombre nick del usuario */}
                <Link to={`/perfil/${usuario.username}`}>Ver perfil</Link> {/* el link al perfil del usuario */}
              </div>
            );
          })}
        </div>
      </div>

      <div className="Explore__section">
        <h2 className="Explore__title">Explorar</h2>
        <Grid posts={posts} /> {/* componente grid con sus prop posts */}
      </div>
    </Main>
  );
}
