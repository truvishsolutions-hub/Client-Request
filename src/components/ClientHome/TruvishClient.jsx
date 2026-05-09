import React, { useState, useEffect, useRef } from "react";
import "./TruvishClient.css";

import logo from "../../assets/LOGO/TV-BG.png";
import wallpaper from "../../assets/HOME/HM.png";
import bgImage from "../../assets/HOMEBG/BG.jpeg";
import { CiWallet } from "react-icons/ci";
import defaultProfile from "../../assets/DefaultProfile/DP.png";

const TruvishClient = ({
  onStart,
  onOpenHistory,
  onOpenTc,
  onOpenWallet,
  onOpenProfile,
  clientBalance,
  profileImg,
}) => {
  const [openMenu, setOpenMenu] = useState(false);
  const [liveBalance, setLiveBalance] = useState(clientBalance ?? 0);
  const [effect, setEffect] = useState(false);

  const menuRef = useRef();
  const [imgSrc, setImgSrc] = useState(profileImg || defaultProfile);

  useEffect(() => {
    setImgSrc(profileImg || defaultProfile);
  }, [profileImg]);

  useEffect(() => {
    setLiveBalance(clientBalance ?? 0);

    // trigger effect when balance updates
    setEffect(true);
    const t = setTimeout(() => setEffect(false), 2000);
    return () => clearTimeout(t);
  }, [clientBalance]);

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

  const stars = ["s1", "s2", "s3", "s4", "s5", "s6"];

  return (
    <div className="tm-bg" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="tm-container">

        {/* TOPBAR */}
        <div className="tm-topbar">

          <img src={logo} className="tm-logo-left" alt="logo" />

          {/* BALANCE */}
          <div className="tm-wallet-pill center" onClick={onOpenWallet}>
            <CiWallet className="tm-wallet-icon" />

            <div className="tm-wallet-text">
              <span className="tm-wallet-label">BALANCE</span>

              <div className="tm-amount-wrap">
                {effect &&
                  stars.map((s, i) => (
                    <span key={i} className={`tm-star ${s}`}>✦</span>
                  ))}

                {effect && <span className="tm-shine" />}

                <span className={`tm-wallet-amount ${effect ? "active" : ""}`}>
                  ₹{Number(liveBalance || 0)}
                </span>
              </div>
            </div>

            <span className="tm-wallet-dot" />
          </div>

          {/* PROFILE */}
          <div className="tm-profile-wrap" ref={menuRef}>
            <img
              src={imgSrc}
              alt="Profile"
              className="tm-profile-img"
              onClick={() => setOpenMenu(!openMenu)}
              onError={() => setImgSrc(defaultProfile)}
            />

            <div className={`tm-slide-menu ${openMenu ? "open" : ""}`}>
              <div className="tm-menu-item" onClick={() => { setOpenMenu(false); onOpenProfile?.(); }}>
                Profile
              </div>
              <div className="tm-menu-item" onClick={() => { setOpenMenu(false); onOpenHistory?.(); }}>
                History
              </div>
              <div className="tm-menu-item" onClick={() => { setOpenMenu(false); onOpenTc?.(); }}>
                T&C
              </div>
            </div>
          </div>

        </div>

        {/* CONTENT */}
        <div className="tm-content">
          <img src={wallpaper} className="tm-wallpaper" alt="Wallpaper" />
          <h1 className="tm-heading">Request a Voucher Code</h1>
        </div>

        {/* FOOTER */}
        <div className="tm-footer">
          <button className="tm-button" onClick={onStart}>
            Start Request →
          </button>

          <div className="tm-secure">🔒 Secure & Encrypted</div>
        </div>

      </div>
    </div>
  );
};

export default TruvishClient;