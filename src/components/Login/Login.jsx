import React, { useMemo, useState } from "react";
import "./Login.css";

import logo from "../../assets/LOGO/TVBG.png";
import bgImage from "../../assets/HOMEBG/BG25.png";

import { FiPhone } from "react-icons/fi";

const LoginPage = ({ onGetOtp }) => {
  const [mobile, setMobile] = useState("");
  const [touched, setTouched] = useState(false);

  const value = useMemo(
    () => mobile.replace(/\D/g, "").slice(0, 10),
    [mobile]
  );

  const isValid = value.length === 10;

  const handleChange = (e) => {
    setMobile(
      e.target.value.replace(/\D/g, "").slice(0, 10)
    );
  };

  const handleGetOtp = () => {
    setTouched(true);

    if (!isValid) return;

    onGetOtp?.({
      mobile: value,
    });
  };

  return (
    <div className="login-page">

      {/* TOP IMAGE */}
      <div
        className="top-image"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      />

      {/* CARD WRAPPER */}
      <div className="card-wrapper">

        <div className="login-card">

          {/* Logo */}
          <div className="logo-wrapper">
            <div className="logo-circle">
              <img
                src={logo}
                alt="Truvish Logo"
                className="logo-img"
              />

              <h3 className="logo-text">
                TRUVISH
              </h3>
            </div>
          </div>

          {/* Heading */}
          <h1 className="welcome-title">
            Welcome to Truvish
          </h1>

          {/* Offer */}
         <div className="offer-text">
           <div className="offer-highlight-wrapper">
             <span className="offer-highlight">
               ₹1000 FREE CREDIT
             </span>
           </div>

           <span className="offer-normal">
             Signup today. limited time offer
           </span>
         </div>

          {/* Input */}
          <div className="input-section">
            <p className="input-label">
              Enter your mobile number to continue
            </p>

            <div
              className={`phone-input ${
                value.length > 0 ? "active" : ""
              }`}
            >
              <FiPhone className="phone-icon" />

              <input
                type="tel"
                inputMode="numeric"
                placeholder="Enter your number"
                value={value}
                onChange={handleChange}
                onBlur={() => setTouched(true)}
              />
            </div>

            {touched && !isValid && (
              <div className="error-text">
                Please enter valid 10 digit number
              </div>
            )}
          </div>

          {/* Button */}
          <button
            className="otp-btn"
            onClick={handleGetOtp}
            disabled={!isValid}
          >
            Get OTP
          </button>

        </div>

      </div>
    </div>
  );
};

export default LoginPage;