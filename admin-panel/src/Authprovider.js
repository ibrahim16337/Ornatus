import axios from "axios";

const apiUrl = "http://localhost:4000/api";

const authProvider = {
  login: ({ email, password }) => {
    email = "admin@gmail.com"
    const url = `${apiUrl}/users/login`
    return axios.post(url, { email, password })
      .then(response => {
        console.log(response)
        if (!response.data.token) {
          throw new Error('Login failed. No token received.');
        }
        if(response.data.role!=="admin"){
          throw new Error('Not a Admin User.');
        }
        localStorage.setItem('token', response.data.token);
      })
      .catch((error) => {
        throw new Error(`Login failed: ${error.message}`);
      });
  },

  logout: () => {
    localStorage.removeItem('token');
    return Promise.resolve();
  },

  checkAuth: () => {
    return localStorage.getItem('token') ? Promise.resolve() : Promise.reject();
  },

  checkError: (error) => {
    const status = error.response ? error.response.status : null;
    if (status === 401 || status === 403) {
      localStorage.removeItem('token');
      return Promise.reject();
    }
    return Promise.resolve();
  },

  getPermissions: () => {
    // Implement your permission logic if needed
    return Promise.resolve();
  }
};

export default authProvider;
