import React, { useState } from "react";
import "./SelectQuantity.css";
import bgImage from "../../assets/HOMEBG/BG.jpeg";
import voucherImage from "../../assets/CARD/CD4.png";
import tickSound from "../../assets/MUSIC/select.wav";
import { IoChevronBack } from "react-icons/io5";

export default function SelectQuantity({
  defaultQuantity = 1,
  voucherValue = 500,
  clientBalance = 0,
  onBack,
  onContinue,
}) {
  const [quantity, setQuantity] = useState(1);
  const total = quantity * Number(voucherValue);
  const isExceeded = total > Number(clientBalance);

  const playTick = () => {
    const audio = new Audio(tickSound);
    audio.volume = 0.4;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  return (
    <div className="qty-bg" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="qty-container">
        {/* STICKY HEADER */}
        <div className="qty-sticky-header">
          <div className="qty-header">
            <button className="qty-back-btn" onClick={onBack}>
              <IoChevronBack size={26} />
            </button>
          </div>

          <div className="qty-step-text">STEP 2: QUANTITY SELECTION</div>

          <div className="qty-progress-bar">
            <div className="qty-progress" />
          </div>
        </div>

        {/* TITLE */}
        <h2 className="qty-question">Select quantity</h2>
        <p className="qty-subtext">
          Choose how many voucher codes you want.
        </p>

        {/* SCROLL AREA */}
        <div className="qty-scroll-area">
          {/* VOUCHER STACK */}
          <div className="voucher-stage">
            {[...Array(quantity)].map((_, i) => {
              const index = quantity - 1 - i;
              return (
                <div
                  key={index}
                  className="voucher-card"
                  style={{
                    zIndex: quantity - i,
                    "--offsetX": `${i * 25}px`,
                    "--offsetY": `${i * 10}px`,
                    "--scale": `${1 - i * 0.03}`
                  }}
                >
                  <img
                    src={voucherImage}
                    alt="Voucher"
                    className="voucher-image"
                  />
                  <div className="voucher-overlay">
                    <div className="voucher-brand">TRUVISH</div>
                    <div className="voucher-amount">
                      ₹{voucherValue.toLocaleString()}
                    </div>
                    <div className="voucher-text">xxx-xxx-xxx</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* MIDDLE WRAPPER */}
          <div className="qty-middle-wrapper">
            {/* WARNING CARD */}
            {isExceeded && (
              <div className="qty-warning-card">
                <div className="warning-icon">⚠</div>
                <div className="warning-content">
                  <div className="warning-title">
                    Insufficient Balance
                    {quantity > 1 ? "s" : ""}
                  </div>
                  <div className="warning-balance">
                    Available balance:
                    <span className="balance-red">
                      {" "}₹{clientBalance.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* SUMMARY CARD */}
            <div className="qty-summary-card">
              <div className="summary-content">
                <div className="selected-line-row">
                  <span className="small-line" />
                  <span className="selected-text">
                    {quantity} code{quantity > 1 ? "s" : ""} selected
                  </span>
                  <span className="small-line" />
                </div>

                <div className="summary-divider" />

                <div className="qty-total-title">Total Amount</div>
                <div className="qty-total-price">
                  ₹{total.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* SLIDER SECTION */}
          <div className="qty-slider-section">
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={quantity}
              onChange={(e) => {
                const value = Number(e.target.value);
                setQuantity(value);
                playTick();
              }}
              className="qty-slider"
            />
            <div className="qty-labels">
              {[1, 2, 3, 4, 5].map((num) => (
                <span
                  key={num}
                  className={quantity === num ? "active-label" : ""}
                >
                  {num}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="qty-footer">
          <button
            className={`qty-next-btn ${isExceeded ? "add-money-btn" : ""}`}
            onClick={() => onContinue?.(quantity)}
          >
            {isExceeded ? "Add Money" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}