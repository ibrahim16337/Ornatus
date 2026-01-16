import React from "react";
import './footer.css';
import { FaLocationDot } from "react-icons/fa6";
import { IoIosCall } from "react-icons/io";
import { IoIosMail } from "react-icons/io";
import { FaFacebook } from "react-icons/fa";


const Footer = () => {
    return(
        <div className="footer-main">
            <div className="footer-content">
                <h6 className="footer-maintext">Creative Interior Solutions</h6>
                <div className="footer-columns">
                    <div className="footer-col-1">
                        <h5 className="col-1-title">Ornatus</h5>
                        <h4 className="col-1-text">ORNATUS is a brand which is embarked on a mission to provide affordable, durable and modern lifestyle</h4>

                    </div>
                    <div className="footer-col-2">
                    <h5 className="col-2-title">Quick Links</h5>
                    <a href="" className="col-2-links">Home</a>
                    <a href="" className="col-2-links">Services</a>
                    <a href="" className="col-2-links">About</a>
                    <a href="" className="col-2-links">Contact</a>

                    </div>
                    <div className="footer-col-3">
                    <h5 className="col-3-title">Have a query?</h5>
                    <a href="" className="col-3-links"><FaLocationDot /> 53-III, K Block, Model Town,, Lahore, Pakistan</a><hr className="col-3-sepration"/>
                    <a href="" className="col-3-links"><IoIosCall /> 03344688189</a><hr className="col-3-sepration"/>
                    <a href="" className="col-3-links"><IoIosMail /> ibrahimwahid6337@gmail.com</a><hr className="col-3-sepration"/>
                    <a href="" className="col-3-links"><FaFacebook /> Facebook</a>

                    </div>

                </div>
                <h3 className="footer-end-text">Copyright ©2023 All rights reserved</h3>
            </div>

        </div>
    );
};
export default Footer;

