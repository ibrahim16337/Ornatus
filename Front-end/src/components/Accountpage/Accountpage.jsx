import React from "react";
//import { Link } from "react-router-dom";
import userService from "../../services/UserService"; 
import Navbar from "../../containers/Navbar/Navbar";
import Footer from "../../containers/Footer/Footer";


const Accountpage = () => {
  return (<>
    <Navbar />
    <div className="static">
        
      {userService.isLoggedIn() && (<div>
        <h2>{userService.getLoggedInUser().username}</h2>
          <button
            variant="contained"
            color="primary"
            onClick={(e) => {
              userService.logout();
              window.location.href = '/';
            }}
          >
            LogOut
          </button>
          </div>
        )}
      </div>
      <Footer />
      </>
  );
};

export default Accountpage;
