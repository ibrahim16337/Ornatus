import React, { useState } from "react";
import './signupform.css';
import { FcGoogle } from "react-icons/fc";
import userService from "../../services/UserService";

const Signupform = ({ history }) => {
    // State for form fields
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [validationErrors, setValidationErrors] = useState({});

    // Validate email format
    const isValidEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    // Validate form fields
    const validateForm = () => {
        const errors = {};
        if (!firstName) errors.firstName = "First Name is required.";
        if (!lastName) errors.lastName = "Last Name is required.";
        if (!email) {
            errors.email = "Email is required.";
        } else if (!isValidEmail(email)) {
            errors.email = "Please enter a valid email.";
        }
        if (!password) {
            errors.password = "Password is required.";
        } else if (password.length < 8) {
            errors.password = "Password must be at least 8 characters long.";
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSignup = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const username = `${firstName} ${lastName}`;
        userService.register(username, email, password)
            .then(() => {
                window.location.href = '/account/login';
                history.push("/");
            })
            .catch(err => {
                setError("Failed to signup"); // Set error message if signup fails
                console.error("Signup failed", err);
            });
    };

    return (
        <div className="signup-form-main">
            <div className="signup-form">
                <div className="signup-form-top-text">
                    <h2 className="signup">Signup</h2>
                    <h5 className="signup-2">Enter your information below to proceed. If you already have an account, please log in instead.</h5>
                </div>
                <div className="input-form">
                    <form onSubmit={handleSignup} className="input-form">
                        <div className="name-fields">
                            <input
                                type="text"
                                placeholder="First Name"
                                className={`input-first-name ${validationErrors.firstName ? 'input-error' : ''}`}
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            {validationErrors.firstName && <div className="error-message">{validationErrors.firstName}</div>}
                            <input
                                type="text"
                                placeholder="Last Name"
                                className={`input-last-name ${validationErrors.lastName ? 'input-error' : ''}`}
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            {validationErrors.lastName && <div className="error-message">{validationErrors.lastName}</div>}
                        </div>
                        <input
                            type="text"
                            placeholder="Email Address"
                            className={`input-field ${validationErrors.email ? 'input-error' : ''}`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {validationErrors.email && <div className="error-message">{validationErrors.email}</div>}
                        <input
                            type="password"
                            placeholder="Password"
                            className={`input-field ${validationErrors.password ? 'input-error' : ''}`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {validationErrors.password && <div className="error-message">{validationErrors.password}</div>}
                        <button type="submit" className="signup-button">Signup</button>
                    </form>
                    {error && <div className="error-message">{error}</div>}
                </div>
                <div className="signup-form-bottom">
                    <a href="/account/signin-with-google" className="google-signup">Signup with Google <FcGoogle /></a>
                    <hr className="separation" />
                    <div>
                        <span className="have-acc">Already have an account?</span>
                        <a href="/account/login" className="login-acc">Login</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signupform;
