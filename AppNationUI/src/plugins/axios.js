import axios from 'axios'
import VueCookies from "vue-cookies";

export default {
  install: (app, options) => {
    const axiosInstance = axios.create({
      baseURL: options.baseUrl,
      headers: {
        Authorization: options.token ? `Bearer ${options.token}` : '',
      }
    });
    axiosInstance.interceptors.request.use(
      (config) => {
        const token = VueCookies.get("authtoken");
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(function (response) {
      return response;
    }, function (error) {
      if (error.response.status === 401) {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    });

    app.config.globalProperties.$axios = axiosInstance;
  }
}
