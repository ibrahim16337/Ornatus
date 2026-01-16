import axios from 'axios';

const apiUrl = 'http://localhost:4000/api/';

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const dataProvider = {
  getList: (resource) => {
    return axiosInstance.get(resource)
      .then((response) => response.data)
      .catch((error) => {
        throw new Error(`Error fetching ${resource} list: ${error}`);
      });
  },
  getOne: (resource, data) => {
    return axiosInstance.get(`${resource}/get-by-id/${data.id}`)
      .then((response) => response.data)
      .catch((error) => {
        throw new Error(`Error fetching ${resource}: ${error}`);
      });
  },
  create: (resource, data) => {
    return axiosInstance.post(resource, data)
      .then((response) => response.data)
      .catch((error) => {
        throw new Error(`Error creating ${resource}: ${error}`);
      });
  },
  // update: (resource, params) => {
  //   const { data } = params;
  //   const url = `${apiUrl}${resource}/${data.id}`;
  //   console.log("URL:", url)
  //   console.log(data)
  //   return axiosInstance.put(url, data)
  //     .then((response) => response.data)
  //     .catch((error) => {
  //       throw new Error(`Error updating ${resource}: ${error}`);
  //     });
  // },
  // update: (resource, params) => {
  //   const { data } = params;
  //   const url = `${apiUrl}${resource}/${data.id}`;
  //   console.log("URL:", url);
  //   console.log(data);
    
  //   return axiosInstance.put(url, data)
  //     .then((response) => {
  //       return { data: response.data }; // Ensure response has a 'data' key
  //     })
  //     .catch((error) => {
  //       throw new Error(`Error updating ${resource}: ${error}`);
  //     });
  // },
  update: (resource, params) => {
    const { data } = params;
    const url = `${apiUrl}${resource}/${data.id}`;
    
    return axiosInstance.put(url, data)
      .then((response) => {
        // Ensure response has an 'id' key
        if (!response.data.hasOwnProperty('id')) {
          throw new Error(`Error updating ${resource}: Response data does not contain an 'id' key`);
        }
        return { data: response.data };
      })
      .catch((error) => {
        throw new Error(`Error updating ${resource}: ${error}`);
      });
  },
  

  delete: (resource, data) => {
    return axiosInstance.delete(`${resource}/${data.id}`)
      .then((response) => response.data)
      .catch((error) => {
        throw new Error(`Error deleting ${resource}: ${error}`);
      });
  },
};

export default dataProvider;
