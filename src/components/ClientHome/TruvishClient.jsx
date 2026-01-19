import React from "react";
import "./TruvishClient.css";
import logo from "../../assets/LOGO/TRV.png";
import wallpaper from "../../assets/HOME/HM.png";

const TruvishClient = ({ onStart }) => {
  return (
    <div className="tm-container">
      <div className="tm-logo-wrap">
        <img src={logo} className="tm-logo" alt="Truvish Logo" />
        <h2 className="tm-title">Truvish</h2>
      </div>

      <div className="tm-wallpaper-wrap">
        <img src={wallpaper} className="tm-wallpaper" alt="Wallpaper" />
      </div>

      <h1 className="tm-heading">Request a Voucher Code</h1>
      <p className="tm-subtext">
        Chat with our assistant to find and claim your rewards in seconds.
      </p>

      <button className="tm-button" onClick={onStart}>
        Start Request →
      </button>

      <div className="tm-secure">🔒 Secure & Encrypted</div>
    </div>
  );
};

export default TruvishClient;
