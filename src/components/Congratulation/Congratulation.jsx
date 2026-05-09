import React, { useState } from "react";
import "./Congratulation.css";

import { BsCopy } from "react-icons/bs";
import { MdOutlineSaveAlt } from "react-icons/md";
import { CiShare2 } from "react-icons/ci";

import { MdOutlineHowToReg } from "react-icons/md";
import { FaFileContract } from "react-icons/fa";
import { IoIosHome } from "react-icons/io";

import ShareVoucher from "./ShareVoucher";

export default function Congratulation({
  voucherCode,
  validityDays,
  onRedeemNow,
  onViewDetails,
  onCopy,
  onGoHome,
}) {

  const [showToast, setShowToast] = useState(false);

  const [showRedeem, setShowRedeem] = useState(false);

  const [showTerms, setShowTerms] = useState(false);

  const [showShare, setShowShare] = useState(false);

  const handleCopy = () => {

    navigator.clipboard.writeText(voucherCode || "");

    onCopy && onCopy(voucherCode);

    setShowToast(true);

    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="success-page">

      {/* HOME */}
      <div className="home-btn" onClick={onGoHome}>
        <IoIosHome />
      </div>

      <div className="center-box">

        {/* TICK */}
        <div className="circle">

          <svg viewBox="0 0 52 52" className="checkmark">

            <circle
              cx="26"
              cy="26"
              r="25"
              fill="none"
              className="checkmark-circle"
            />

            <path
              fill="none"
              d="M14 27l7 7 16-16"
              className="checkmark-check"
            />

          </svg>

        </div>

        {/* TITLE */}
        <h1 className="title">
          Congratulations!
        </h1>

        <p className="subtitle">
          Your reward is ready
        </p>

        {/* VOUCHER */}
        <div className="voucher-box">

          <p className="voucher-label">
            YOUR UNIQUE VOUCHER CODE
          </p>

          <div className="voucher-code">
            {voucherCode || "---- ----"}
          </div>

          {/* ACTIONS */}
          <div className="actions">

            {/* COPY */}
            <div
              className="action-item"
              onClick={handleCopy}
            >
              <BsCopy />
              <span>Copy</span>
            </div>

            {/* SAVE */}
            <div className="action-item">
              <MdOutlineSaveAlt />
              <span>Save</span>
            </div>

            {/* SHARE */}
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

          <div
            className="list-item clickable"
            onClick={() => setShowRedeem(!showRedeem)}
          >

            <div className="left">
              <MdOutlineHowToReg />
              <span>How to Redeem</span>
            </div>

            <span
              className={`arrow ${
                showRedeem ? "rotate" : ""
              }`}
            >
              ›
            </span>

          </div>

          <div
            className={`redeem-dropdown ${
              showRedeem ? "open" : ""
            }`}
          >

            <div className="redeem-content">

              <div className="step">
                <span>1.</span>

                <p>
                  Open the app or website and login to your account.
                </p>
              </div>

              <div className="step">
                <span>2.</span>

                <p>
                  Go to the Wallet / Redeem Voucher section.
                </p>
              </div>

              <div className="step">
                <span>3.</span>

                <p>
                  Enter your voucher or promo code carefully.
                </p>
              </div>

              <div className="step">
                <span>4.</span>

                <p>
                  Click on the Redeem Now button to apply the code.
                </p>
              </div>

              <div className="step">
                <span>5.</span>

                <p>
                  Reward amount or benefits will be added instantly
                  to your account.
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* TERMS & CONDITIONS */}
        <div className="redeem-wrapper">

          <div
            className="list-item clickable"
            onClick={() => setShowTerms(!showTerms)}
          >

            <div className="left">
              <FaFileContract />
              <span>Terms & Conditions</span>
            </div>

            <span
              className={`arrow ${
                showTerms ? "rotate" : ""
              }`}
            >
              ›
            </span>

          </div>

          <div
            className={`redeem-dropdown ${
              showTerms ? "open" : ""
            }`}
          >

            <div className="redeem-content">

              <div className="step">
                <span>1.</span>

                <p>
                  Each voucher code can be used only once per user.
                </p>
              </div>

              <div className="step">
                <span>2.</span>

                <p>
                  Voucher codes are valid for a limited time only.
                </p>
              </div>

              <div className="step">
                <span>3.</span>

                <p>
                  Rewards are non-transferable and cannot be exchanged
                  for cash.
                </p>
              </div>

              <div className="step">
                <span>4.</span>

                <p>
                  The company reserves the right to cancel invalid or
                  suspicious redemptions.
                </p>
              </div>

              <div className="step">
                <span>5.</span>

                <p>
                  By redeeming the code, users agree to all platform
                  rules and policies.
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* BUTTONS */}
        <div className="buttons">

          <button
            className="redeem-btn"
            onClick={onRedeemNow}
          >
            REDEEM NOW
          </button>

          <button
            className="details-btn"
            onClick={onViewDetails}
          >
            VIEW DETAILS
          </button>

        </div>

      </div>

      {/* TOAST */}
      {showToast && (

        <div className="tm-toast">

          <span className="tm-toast-icon">
            ✔
          </span>

          copied to clipboard!

        </div>

      )}

      {/* SHARE MODAL */}
      <ShareVoucher
        open={showShare}
        onClose={() => setShowShare(false)}
      />

    </div>
  );
}