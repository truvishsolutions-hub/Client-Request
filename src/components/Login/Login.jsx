import React, { useMemo, useState, useEffect } from "react";
import "./Login.css";
import logo from "../../assets/LOGO/TVBG.png";
import bgImage from "../../assets/HOMEBG/BG.jpeg";

export default function Login({ countryCode = "+91", onGetOtp }) {
  const [mobile, setMobile] = useState("");
  const [touched, setTouched] = useState(false);
  const [animate, setAnimate] = useState(true); // 👈 animation control

  const value = useMemo(() => mobile.replace(/\D/g, "").slice(0, 10), [mobile]);
  const isValid = value.length === 10;

  const handleChange = (e) => {
    setMobile(e.target.value.replace(/\D/g, "").slice(0, 10));
  };

  const handleGetOtp = () => {
    setTouched(true);
    if (!isValid) return;
    onGetOtp?.({ countryCode, mobile: value });
  };

  // 🔥 har 5 sec me animation restart
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(false);
      setTimeout(() => setAnimate(true), 50); // re-trigger
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="loginPage"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="overlay"></div>

      <div className="contentWrap">
        <div className="topSection">
          <div className="logoWrap">
            <img src={logo} alt="Truvish" className="brandLogo" />
          </div>

          <div className="brandTextWrap">
            <h2 className="brandName">TRUVISH</h2>
            <p className="brandTagline">Performance Rewards Simplified</p>
          </div>

          <h1 className="title">Welcome to Truvish</h1>

          {/* 👇 dynamic class */}
          <div className={`offerPill ${animate ? "animate" : ""}`}>
            Rs.1000 free credit. Signup today. limited time offer.
          </div>
        </div>

        <div className="middleSection">
          <p className="subtitle">Enter your mobile number to continue</p>

          <div className="phoneRow">
            <div className="codePill">{countryCode}</div>

            <input
              type="tel"
              inputMode="numeric"
              className="phoneInput"
              placeholder="Enter 10-digit number"
              value={value}
              onChange={handleChange}
              onBlur={() => setTouched(true)}
            />
          </div>

          {touched && !isValid && (
            <div className="errorText">Please enter a valid 10-digit number</div>
          )}

          <p className="helperText">
            Performance Marketing Powered by Rewards
          </p>
        </div>
      </div>

      <div className="bottomSection">
        <button
          className="primaryBtn"
          onClick={handleGetOtp}
          disabled={!isValid}
        >
          Get OTP
        </button>
      </div>
    </div>
  );
}