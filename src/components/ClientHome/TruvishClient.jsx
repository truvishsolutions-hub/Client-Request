import React, { useState, useEffect, useRef } from "react";
import "./TruvishClient.css";

import logo from "../../assets/LOGO/TRV.png";
import wallpaper from "../../assets/HOME/HM.png";

import { IoWalletSharp } from "react-icons/io5";

import defaultProfile from "../../assets/DefaultProfile/DP.png";

const TruvishClient = ({
  onStart,
  onOpenHistory,
  onOpenTc,
  onOpenWallet,
  clientBalance,
  profileImg
}) => {

  const [openMenu, setOpenMenu] = useState(false);

  const menuRef = useRef();

  // ✅ SAFE PROFILE IMAGE (404 FIX)
  const [imgSrc, setImgSrc] = useState(profileImg || defaultProfile);

  useEffect(() => {
    setImgSrc(profileImg || defaultProfile);
  }, [profileImg]);

  useEffect(() => {

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);

  }, []);

  return (
    <div className="tm-container">

      {/* TOP BAR */}
      <div className="tm-topbar">

        {/* WALLET */}
        <div className="tm-wallet-wrap" onClick={onOpenWallet}>
          <IoWalletSharp className="tm-wallet" />
          <span className="tm-wallet-balance">
            ₹{clientBalance ?? 0}
          </span>
        </div>

        {/* PROFILE */}
        <div className="tm-profile-wrap" ref={menuRef}>

          <img
            src={imgSrc}
            alt="Profile"
            className="tm-profile-img"
            onClick={() => setOpenMenu(!openMenu)}
            onError={() => setImgSrc(defaultProfile)} // ✅ fallback
          />

          <div className={`tm-slide-menu ${openMenu ? "open" : ""}`}>

            <div
              className="tm-menu-item"
              onClick={() => {
                setOpenMenu(false);
                onOpenHistory?.();
              }}
            >
              History
            </div>

            <div
              className="tm-menu-item"
              onClick={() => {
                setOpenMenu(false);
                onOpenTc?.();
              }}
            >
              T&C
            </div>

          </div>

        </div>

      </div>

      {/* LOGO */}
      <div className="tm-logo-wrap">
        <img src={logo} className="tm-logo" alt="Truvish Logo" />
      </div>

      {/* WALLPAPER */}
      <div className="tm-wallpaper-wrap">
        <img
          src={wallpaper}
          className="tm-wallpaper"
          alt="Wallpaper"
        />
      </div>

      {/* CONTENT */}
      <h1 className="tm-heading">Request a Voucher Code</h1>

      <p className="tm-subtext">
        Chat with our assistant to find and claim your rewards in seconds.
      </p>

      <button className="tm-button" onClick={onStart}>
        Start Request →
      </button>

      <div className="tm-secure">
        🔒 Secure & Encrypted
      </div>

    </div>
  );
};

export default TruvishClient;