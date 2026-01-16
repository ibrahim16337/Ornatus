import GenericService from "../services/GenericServices";
import {jwtDecode} from "jwt-decode";
class UserService extends GenericService {

  login = (email, password) =>
    new Promise((resolve, reject) => {
      this.post("users/login", { email, password })
        .then((response) => {
          localStorage.setItem("token", response.token);
          resolve(response.token);
        })
        .catch((err) => {
          reject(err);
        });
    });
  register = (name, email, password) =>
    this.post("users/register", { password, email, name });
  logout = () => {
    localStorage.removeItem("token");
  };
  isLoggedIn = () => {
    return localStorage.getItem("token") ? true : false;
  };
  getLoggedInUser = () => {
    try {
      const jwt = localStorage.getItem("token");
      return jwtDecode(jwt);
    } catch (ex) {
      return null;
    }
  };
  isAdmin = () => {
    if (this.isLoggedIn()) {
      if (this.getLoggedInUser().role === "admin") return true;
      else return false;
    } else return false;
  };
}

let userService = new UserService();
export default userService;
