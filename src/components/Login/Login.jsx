import React, { useMemo, useState } from "react";
import "./Login.css";
import logo from "../../assets/LOGO/TRV.png";

export default function Login({ countryCode = "+91", onGetOtp }) {
  const [mobile, setMobile] = useState("");
  const [touched, setTouched] = useState(false);

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

  return (
    <div className="loginPage">
      {/* 🔝 TOP */}
      <div className="topSection">
        <img src={logo} alt="Truvish" className="brandLogo" />
        <h1 className="title">Welcome to Truvish</h1>
      </div>

      {/* 🔼 MIDDLE */}
      <div className="middleSection">
        <p className="subtitle">Enter your mobile number to continue</p>

        <div className="phoneRow">
          <div className="codePill">{countryCode}</div>

          <input
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
      </div>

      {/* 🔻 BOTTOM */}
      <div className="bottomSection">
        <button className="primaryBtn" onClick={handleGetOtp} disabled={!isValid}>
          Get OTP
        </button>

        <div className="secure">🔒 Secure & Encrypted</div>
      </div>
    </div>
  );
}
