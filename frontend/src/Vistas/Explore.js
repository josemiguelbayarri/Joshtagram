import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../Componentes/Loading';
import { ImagenAvatar } from '../Componentes/Avatar';
import Axios from 'axios';
import Main from '../Componentes/Main';
import Grid from '../Componentes/Grid';

export default function Explore({ mostrarError }) {
  const [posts, setPosts] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarPostsYUsuarios() {
      try {
        const [posts, usuarios] = await Promise.all([
          Axios.get('/api/posts/explore').then(({ data }) => data),
          Axios.get('/api/usuarios/explore').then(({ data }) => data)
        ]);
        setPosts(posts);
        setUsuarios(usuarios);
        setLoading(false);
      } catch (error) {
        mostrarError(
          'Hubo un problema cargando explore. Por favor refresca la página.'
        );
        console.log(error);
      }
    }

    cargarPostsYUsuarios();
  }, []);

  if (loading) {
    return (
      <Main center>
        <Loading />
      </Main>
    );
  }

  return (
    <Main>
      <div className="Explore__section">
        <h2 className="Explore__title">Descubrir usuarios</h2>
        <div className="Explore__usuarios-container">
          {usuarios.map(usuario => {
            return (
              <div className="Explore__usuario" key={usuario._id}>
                <ImagenAvatar usuario={usuario} />
                <p>{usuario.username}</p>
                <Link to={`/perfil/${usuario.username}`}>Ver perfil</Link>
              </div>
            );
          })}
        </div>
      </div>

      <div className="Explore__section">
        <h2 className="Explore__title">Explorar</h2>
        <Grid posts={posts} />
      </div>
    </Main>
  );
}
