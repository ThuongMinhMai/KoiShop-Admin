import axios from "axios"

const koiAPI = axios.create({
    baseURL: 'https://koi-api.uydev.id.vn',
    timeout: 50000,
    headers: {
      "Content-Type": "application/json"
    }
  })
  koiAPI.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('tokenHeader');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (!(config.data instanceof FormData)) {
            config.headers.Accept = 'application/json';
            config.headers['Content-Type'] = 'application/json';
        } else {
            // Khi sử dụng FormData, trình duyệt tự động thiết lập Content-Type
            delete config.headers['Content-Type'];
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
// busAPI.interceptors.response.use(
// 	(response) => response.data,
// 	(error) => {
// 		if (error.response.status === 401) {
// 			/* empty */
// 		}
// 		return Promise.reject(error)
// 	},
// )
export default koiAPI