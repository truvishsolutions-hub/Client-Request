import React, { useState, useEffect, useRef } from "react";
import "./TruvishClient.css";

import logo from "../../assets/LOGO/TVBG.png";
import bgImage from "../../assets/HOMEBG/BG3.png";

import { CiWallet } from "react-icons/ci";

const TruvishClient = ({
  onStart,
  onOpenHistory,
  onOpenTc,
  onOpenWallet,
  onOpenProfile,
  clientBalance = 1000,
}) => {
  const [openMenu, setOpenMenu] = useState(false);
  const [liveBalance, setLiveBalance] = useState(clientBalance);
  const [effect, setEffect] = useState(false);

  const menuRef = useRef();

  /* =========================
     BALANCE EFFECT
  ========================= */

  useEffect(() => {
    setLiveBalance(clientBalance ?? 0);

    setEffect(true);

    const timer = setTimeout(() => {
      setEffect(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [clientBalance]);

  /* =========================
     OUTSIDE CLICK
  ========================= */

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const stars = ["s1", "s2", "s3", "s4", "s5", "s6"];

  return (
    <div
      className="client-page"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      {/* OVERLAY */}
      <div className="client-overlay"></div>

      {/* HEADER */}
      <header className="client-header">
        {/* LEFT */}
        <div className="header-left">
          <img src={logo} alt="Truvish" className="header-logo" />

          <h2 className="header-logo-text">
            TRUVISH
          </h2>
        </div>

        {/* CENTER */}
        <div
          className="wallet-box"
          onClick={onOpenWallet}
        >
          <CiWallet className="wallet-icon" />

          <div className="wallet-content">
            <span className="wallet-label">
              Balance
            </span>

            <div className="wallet-amount-wrap">

              {effect &&
                stars.map((s, i) => (
                  <span
                    key={i}
                    className={`wallet-star ${s}`}
                  >
                    ✦
                  </span>
                ))}

              {effect && (
                <span className="wallet-shine"></span>
              )}

              <span
                className={`wallet-amount ${
                  effect ? "active" : ""
                }`}
              >
                ₹{Number(liveBalance || 0)}
              </span>
            </div>
          </div>

          <span className="wallet-dot"></span>
        </div>

        {/* RIGHT BURGER */}
        <div
          className={`nav-menu ${
            openMenu ? "open" : ""
          }`}
          ref={menuRef}
        >
          <div id="burger-wrap">
            <button
              className="burger"
              onClick={() => setOpenMenu(!openMenu)}
            >
              <span></span>
            </button>
          </div>

          {/* MENU */}
          <ul
            className={`menu-list ${
              openMenu ? "list-open" : ""
            }`}
          >
            <li
              onClick={() => {
                setOpenMenu(false);
                onOpenProfile?.();
              }}
            >
              Profile
            </li>

            <li
              onClick={() => {
                setOpenMenu(false);
                onOpenHistory?.();
              }}
            >
              History
            </li>

            <li
              onClick={() => {
                setOpenMenu(false);
                onOpenTc?.();
              }}
            >
              T&C
            </li>
          </ul>
        </div>
      </header>

      {/* CONTENT */}
      <div className="client-content">
        <h1 className="voucher-title">
          Request a
          <br />
          Voucher Code
        </h1>

        {/* BUTTON */}
        <button
          className="request-btn"
          onClick={onStart}
        >
          Start Request
        </button>

        <p className="powered-text">
          Powered by Truvish
        </p>
      </div>
    </div>
  );
};

export default TruvishClient;