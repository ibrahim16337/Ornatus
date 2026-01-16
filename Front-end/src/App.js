//import logo from "./logo.svg";
// index.js or App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import "./App.css";

import Landingpage from "./components/Landingpage/Landinpage";
import Loginpage from "./components/Loginpage/Loginpage";
import Signuppage from "./components/Signuppage/Signuppage";
import Shoppingcart from "./components/Shoppingcart/Shoppingcart";
import Productpage from "./components/Productpage/Productpage";
import Checkoutpage from "./components/Checkoutpage/Checkoutpage";
import Categorypage from "./components/Categorypage/Categorypage";
//import Accountpage from './components/Accountpage/Accountpage';
import Profile from './components/Accountpage/Profile';
//import userService from './services/UserService'; 
function App() {
  
  return (
    <div>
      
      <Router>
      
        <Routes>
          <Route path='/' exact Component={Landingpage}/>
          <Route path='/cart' exact Component={Shoppingcart} />
          <Route path='/account' exact Component={Profile} />
          <Route path='/account/login' exact Component={Loginpage} />
          <Route path='/account/register' exact Component={Signuppage} />
          <Route path='/collections/:category' exact Component={Categorypage}/>
          <Route path='/collections/:category/products/:id' exact Component={Productpage}/>
          <Route path='/checkout' exact Component={Checkoutpage} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
