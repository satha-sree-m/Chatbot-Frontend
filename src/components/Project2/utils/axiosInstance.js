 
// import axios from "axios";
// import Cookies from "js-cookie";

// const api = axios.create({
//   baseURL: "http://localhost:5000/api",
//   withCredentials: true,
// });

// api.interceptors.request.use((config) => {
//   const token = Cookies.get("token");
//   if (token) {
//     config.headers = config.headers || {};
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, (error) => Promise.reject(error));

// export default api;


import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// ✅ Interceptor for adding auth header and disabling cache
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");

    // Disable caching for every request
    config.headers["Cache-Control"] = "no-cache";
    config.headers["Pragma"] = "no-cache";
    config.headers["Expires"] = "0";

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Optional: handle 401 globally (auto logout)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("token");
      Cookies.remove("user");
      window.location.href = "/login"; // redirect to login if token expired
    }
    return Promise.reject(error);
  }
);

export default api;
