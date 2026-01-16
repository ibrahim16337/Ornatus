import React, { useState } from "react";
import './loginform.css';
import { FcGoogle } from "react-icons/fc";
import userService from "../../services/UserService";

const Loginform = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [error, setError] = useState("");

    const validateEmail = () => {
        if (!email.trim()) {
            setEmailError("Please enter your email address.");
            return false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError("Email format is invalid.");
            return false;
        }
        return true;
    };

    const validatePassword = () => {
        if (!password.trim()) {
            setPasswordError("Please enter your password.");
            return false;
        }
        return true;
    };

    const handleLogin = (e) => {
        e.preventDefault();

        setEmailError("");
        setPasswordError("");
        setError("");

        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();

        if (isEmailValid && isPasswordValid) {
            userService.login(email, password)
                .then(token => {
                    console.log("Login successful", token);
                    window.alert("Logged In Successfully");
                    window.location.href = '/';
                })
                .catch(err => {
                    setError("Invalid email or password");
                    console.error("Login failed", err);
                });
        }
    };

    return (
        <div className="login-form-main">
            <div className="login-form">
                <div className="login-form-top-text">
                    <h2 className="login">Login</h2>
                    <h5 className="login-2">Already have an account, login!</h5>
                </div>

                <div className="input-form">
                    <form onSubmit={handleLogin} className="input-form">
                        <input
                            type="text"
                            placeholder="Email Address"
                            className={`input-field ${emailError && 'error'}`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {emailError && <div className="error-message">{emailError}</div>}
                        <input
                            type="password"
                            placeholder="Password"
                            className={`input-field ${passwordError && 'error'}`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {passwordError && <div className="error-message">{passwordError}</div>}
                        <button type="submit" className="login-button">Login</button>
                    </form>
                    {error && <div className="error-message">{error}</div>}
                </div>

                <div className="login-form-bottom">
                    <div>
                        <a href="/forget-password" className="forgot-pass">Forgot password?</a>
                        <a href="/signin-with-google" className="google-login">Login with Google <FcGoogle /></a>
                    </div>
                    <hr className="separation" />

                    <div>
                        <span className="no-acc">Don't have an account?</span><a href="/account/register" className="create-acc">Create an Account</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Loginform;
