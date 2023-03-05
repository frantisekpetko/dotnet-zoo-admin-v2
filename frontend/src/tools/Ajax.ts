import axios, { AxiosInstance } from 'axios';

const Ajax: AxiosInstance = axios.create({
    baseURL: window.location.protocol !== 'https:' ? 'http://localhost:7000/api/' : '/api/',
    withCredentials: true,
});

Ajax.interceptors.request.use(
    (config: any) => {
        config.headers.common['Authorization'] = sessionStorage.getItem('token') ? `Bearer ${sessionStorage.getItem('token')}` : '';
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

Ajax.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        function handleHttpError(e: any) {
            console.warn(JSON.parse(JSON.stringify(e)));
            const { statusCode } = e.response.data;

            if (statusCode !== 401) {
                //throw e;
            } else {
                window.location.href = '/login';
            }
        }
        handleHttpError(error);
        return Promise.reject(error);
    }
);

export function headers(token: string) {
    return { headers: { Authorization: `Bearer ${token}` } };
}

export default Ajax;
