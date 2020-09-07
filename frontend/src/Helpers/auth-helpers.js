import Axios from 'axios';//importamos la libreria axios

const TOKEN_KEY = 'JOSHTAGRAM_TOKEN'; //llave del token

export function setToken(token) {//funcion para guardar el token en local storage
  localStorage.setItem(TOKEN_KEY, token);//setitem es el parametro para guardar en localstorage los objetos que le pasamos dentro de los parentesis, en este caso el token
}

export function getToken() {//funcion para leer el token
  return localStorage.getItem(TOKEN_KEY);//retorna el objeto que hay en local storage en este caso el token
}

export function deleteToken() {//funcion para borrar el token
  localStorage.removeItem(TOKEN_KEY);//removeitem borra el elemento que hay en localstorage, en este cos el token
}

export function initAxiosInterceptors() {//funcion para interceptar
  Axios.interceptors.request.use(function(config) {//cuando hacemos una llamada de request usa la funcion config usando la libreria axios
    const token = getToken();//variable token, y nos traemos el token con la funcion gettoken

    if (token) {//si tenemos el token...
      config.headers.Authorization = `bearer ${token}`;//la autorizacion nos devuelve el token en la cavecera
    }

    return config;//devolvemos lo que pasa en esta funcion
  });

  Axios.interceptors.response.use(//interceptamos la respuesta
    function(response) {//en caso de que todo sea exitoso
      return response;//devuelve la respuesta
    },
    function(error) {//funcion de error
      if (error.response.status === 401) {//en caso de que el token este vencido
        deleteToken();//borramos el token de localstorage
        window.location = '/login';//hacemos una redireccion hacia login
      } else {//y si no 
        return Promise.reject(error);//retornamos una promesa con el error
      }
    }
  );
}
