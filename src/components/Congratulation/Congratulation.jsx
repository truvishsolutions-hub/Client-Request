// Congratulation.jsx

import React, { useState } from "react";
import "./Congratulation.css";

import { BsCopy } from "react-icons/bs";
import { MdOutlineSaveAlt } from "react-icons/md";
import { CiShare2 } from "react-icons/ci";

import { MdOutlineHowToReg } from "react-icons/md";
import { FaFileContract } from "react-icons/fa";
import { IoIosHome } from "react-icons/io";

import { IoCheckmarkCircle } from "react-icons/io5";

import ShareVoucher from "./ShareVoucher";

export default function Congratulation({
  voucherCode,
  validityDays,
  client,  // CHANGE: Accept full client object instead of clientLogo
  onRedeemNow,
  onViewDetails,
  onCopy,
  onGoHome,
}) {

  const [showToast, setShowToast] = useState(false);
  const [showRedeem, setShowRedeem] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showShareSuccess, setShowShareSuccess] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codes[activeIndex]);

    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

const codes = Array.isArray(voucherCode)
  ? voucherCode
  : [voucherCode];

const [activeIndex, setActiveIndex] = useState(0);
const [touchStart, setTouchStart] = useState(null);

const nextCode = () => {
  if (activeIndex < codes.length - 1) {
    setActiveIndex(activeIndex + 1);
  }
};

const prevCode = () => {
  if (activeIndex > 0) {
    setActiveIndex(activeIndex - 1);
  }
};

  const handleShareSuccess = () => {
    setShowShareSuccess(true);
    setTimeout(() => {
      setShowShareSuccess(false);
    }, 3000);
  };

const handleTouchStart = (e) => {
  setTouchStart(e.targetTouches[0].clientX);
};

const handleTouchEnd = (e) => {
  if (touchStart === null) return;

  const endX = e.changedTouches[0].clientX;
  const diff = touchStart - endX;

  // swipe left
  if (diff > 50 && activeIndex < codes.length - 1) {
    setActiveIndex((prev) => prev + 1);
  }

  // swipe right
  if (diff < -50 && activeIndex > 0) {
    setActiveIndex((prev) => prev - 1);
  }

  setTouchStart(null);
};

  return (
    <div className="success-page">

      {/* SUCCESS NOTIFICATION */}
      <div className={`top-success ${showShareSuccess ? "show-success" : ""}`}>
        <IoCheckmarkCircle />
        <div>
          <h4>Email Sent Successfully</h4>
          <p>Voucher delivered to recipient inbox</p>
        </div>
      </div>

      {/* HOME */}
      <div className="home-btn" onClick={onGoHome}>
        <IoIosHome />
      </div>

      <div className="center-box">

        {/* TICK */}
        <div className="circle">
          <svg viewBox="0 0 52 52" className="checkmark">
            <circle cx="26" cy="26" r="25" fill="none" className="checkmark-circle" />
            <path fill="none" d="M14 27l7 7 16-16" className="checkmark-check" />
          </svg>
        </div>

        <h1 className="title">Congratulations!</h1>
        <p className="subtitle">Your reward is ready</p>

        {/* VOUCHER */}

        <div className="voucher-box">

          <p className="voucher-label">
            YOUR UNIQUE VOUCHER CODE
          </p>

          <div className="voucher-counter">
            {activeIndex + 1}/{codes.length}
          </div>

          <div
            className="voucher-swipe-area"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="voucher-code">
              {codes[activeIndex]}
            </div>
          </div>

          <div className="dots">
            {codes.map((_, i) => (
              <span
                key={i}
                className={`dot ${i === activeIndex ? "active" : ""}`}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>

          {/* ACTIONS */}
          <div className="actions">
            <div className="action-item" onClick={handleCopy}>
              <BsCopy />
              <span>Copy</span>
            </div>

            <div className="action-item">
              <MdOutlineSaveAlt />
              <span>Save</span>
            </div>

            <div
              className="action-item"
              onClick={() => setShowShare(true)}
            >
              <CiShare2 />
              <span>Share</span>
            </div>
          </div>

        </div>

        {/* VALIDITY */}
        <div className="validity">
          📅 VALID FOR {validityDays || 0} MONTHS
        </div>

        {/* HOW TO REDEEM */}
        <div className="redeem-wrapper">
          <div className="list-item clickable" onClick={() => setShowRedeem(!showRedeem)}>
            <div className="left">
              <MdOutlineHowToReg />
              <span>How to Redeem</span>
            </div>
            <span className={`arrow ${showRedeem ? "rotate" : ""}`}>›</span>
          </div>
          <div className={`redeem-dropdown ${showRedeem ? "open" : ""}`}>
            <div className="redeem-content">
              <div className="step"><span>1.</span><p>Open the app or website and login to your account.</p></div>
              <div className="step"><span>2.</span><p>Go to the Wallet / Redeem Voucher section.</p></div>
              <div className="step"><span>3.</span><p>Enter your voucher code carefully.</p></div>
              <div className="step"><span>4.</span><p>Click on Redeem Now.</p></div>
              <div className="step"><span>5.</span><p>Reward benefits will be added instantly.</p></div>
            </div>
          </div>
        </div>

        {/* TERMS */}
        <div className="redeem-wrapper">
          <div className="list-item clickable" onClick={() => setShowTerms(!showTerms)}>
            <div className="left">
              <FaFileContract />
              <span>Terms & Conditions</span>
            </div>
            <span className={`arrow ${showTerms ? "rotate" : ""}`}>›</span>
          </div>
          <div className={`redeem-dropdown ${showTerms ? "open" : ""}`}>
            <div className="redeem-content">
              <div className="step"><span>1.</span><p>Each voucher code can be used only once.</p></div>
              <div className="step"><span>2.</span><p>Voucher codes are valid for limited time only.</p></div>
              <div className="step"><span>3.</span><p>Rewards cannot be exchanged for cash.</p></div>
              <div className="step"><span>4.</span><p>Invalid redemptions may be cancelled.</p></div>
              <div className="step"><span>5.</span><p>Users agree to all platform policies.</p></div>
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="buttons">
          <button className="redeem-btn" onClick={onRedeemNow}>REDEEM NOW</button>
          <button className="details-btn" onClick={onViewDetails}>VIEW DETAILS</button>
        </div>

      </div>

      {/* TOAST */}
      {showToast && (
        <div className="tm-toast">
          <span className="tm-toast-icon">✔</span>
          copied to clipboard!
        </div>
      )}

      {/* SHARE MODAL */}
      {/* SHARE MODAL */}
      <ShareVoucher
        open={showShare}
        onClose={() => setShowShare(false)}
        onSuccess={handleShareSuccess}
        voucherCode={voucherCode}
        client={client}
        validityDays={validityDays}  // 🔥 YEH LINE HONI CHAHIYE
      />

    </div>
  );
}