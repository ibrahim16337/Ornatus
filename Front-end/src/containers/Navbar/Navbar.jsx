import React, { useState, useEffect } from "react";
import logo from "../../assets/logo_ornatus.png";
import { IoMdHome } from "react-icons/io";
import { FaShoppingCart } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { Link } from "react-router-dom";
import categoryService from "../../services/CategoryService";
import userService from "../../services/UserService"; 
import productService from "../../services/ProductsService";
import "./navbar.css";
import { debounce } from 'lodash';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
//import {useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux';
const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  //const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  useEffect(() => {
    categoryService.getCategories().then((data) => {
      if (Array.isArray(data)) {
        console.log("Data is an Array Already!");
        setCategories(data);
        setLoading(false);
      } else if (typeof data === "object") {
        console.log("Data is an Object and is converted!");
        const productsArray = Object.values(data);
        setCategories(productsArray);
        setLoading(false);
      } else {
        console.error("Data received is not in expected format:", data);
      }
    });
  }, []);

  const fetchSuggestions = (searchTerm) => {
    productService
    .searchProducts(searchTerm)
      .then((data) => {
        setSuggestions(data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }
  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);
  const handleOnSearch = (string, results) => {
    debouncedFetchSuggestions(string);
  };
  const handleOnSelect = (item) => {
    console.log('Selected:', item);
    window.location.href = `/collections/Products/products/${item.timestamp_id}`;
  };

  const handleOnHover = (item) => {
    console.log('Hovered:', item);
  };

  const handleOnFocus = () => {
    console.log('The search input is focused');
  };

  const handleOnClear = () => {
    console.log('The search input is cleared');
    setSuggestions([]);
  };

  const formatResult = (item) => {
    return (
      <Link to={`/collections/Products/products/${item.timestamp_id}`}>
        <span style={{ display: 'block', textAlign: 'left' }}>{item.name}</span>
      </Link>
    )
  }
  //Code for the implementation of cart
  //const navigate = useNavigate()
  const cart = useSelector((state) => state.cart)

  const getTotalQuantity = () => {
    let total = 0
    cart.forEach(item => {
      total += item.quantity
    })
    return total
  }
  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div className="Navbar_main">
    
      <div className="Navbar_header">
        <div className="Navbar_logo">
          <Link to={"/"}>
            <img src={logo} alt="logo_ornatus" className="ornatus-logo" />
          </Link>
        </div>
        <div className="Navbar_searchbar">
        <div style={{ width: 400 }}>
            <ReactSearchAutocomplete
              items={suggestions}
              onSearch={handleOnSearch}
              onSelect={handleOnSelect}
              onHover={handleOnHover}
              onFocus={handleOnFocus}
              onClear={handleOnClear}
              formatResult={formatResult}
            />
          </div>
        </div>
        <div className="Navbar_icons">
          <div className="Navbar_home">
            <Link to={"/"}>
              <IoMdHome className="Navbar_home-icon" />
            </Link>
          </div>
          <div className="Navbar_cart">
            {/* <Link to={"/cart"}>
              <FaShoppingCart className="Navbar_cart-icon" />
            </Link> */}
            <Link to={"/cart"}>
              <FaShoppingCart className="Navbar_cart-icon" />
              <p>{getTotalQuantity() || 0}</p>
            </Link>
          </div>
          <div className="Navbar_profile">
          {userService.isLoggedIn() ? (<Link to={"/account"}>
              <FaUser className="Navbar_profile-icon" />
            </Link>):(<Link to={"/account/login"}>
              <FaUser className="Navbar_profile-icon" />
            </Link>)}
          </div>
        </div>
      </div>
      <div className="Navbar_categories">
        {categories.map((category, index) => (
          <div className="Navbar_category" key={index}>
            <Link to={`/collections/${category['categories']}`}>
              <span className="Navbar_category-Text">{category['categories']}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
