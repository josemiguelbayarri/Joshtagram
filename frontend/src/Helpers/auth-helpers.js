import Axios from "axios";

const TOKEN_KEY = 'JOSHTAGRAM_TOKEN';

export function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(token) {
    localStorage.getItem(TOKEN_KEY);
}

export function deleteToken(token) {
    localStorage.removeItem(TOKEN_KEY);
}

export function initAxiosInterceptors () {
    Axios.interceptors.request.use(function(config) {
        const token = getToken();

        if (token) {
            config.headers.Authorization = `bearer ${token}`;
        }

        return config;
    });

    Axios.interceptors.response.use(
        function(response) {
            return response;
        },
        function(error) {
            if (error.response.status === 401) {
                deleteToken();
                window.location = '/login'
            } else {
                return Promise.reject(error);
            }
        }
    )
}