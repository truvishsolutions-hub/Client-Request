import React from "react";
import "./BrandInfoPopup.css";

const BrandInfoPopup = ({ isOpen, onClose, brand }) => {
  if (!isOpen || !brand) return null;

  // ✅ FIX: handle string → array properly
  const redeemSteps =
    typeof brand.howToRedeem === "string"
      ? brand.howToRedeem.split(/[\n,]+/) // split by comma OR new line
      : Array.isArray(brand.howToRedeem)
      ? brand.howToRedeem
      : [];

  const terms =
    typeof brand.termsAndConditions === "string"
      ? brand.termsAndConditions.split(/[\n,]+/)
      : Array.isArray(brand.termsAndConditions)
      ? brand.termsAndConditions
      : [];

  return (
    <div className="bip-overlay" onClick={onClose}>
      <div
        className="bip-modal"
        onClick={(e) => e.stopPropagation()}
      >

        {/* HEADER */}
        <div className="bip-header">
          <h2 className="bip-title">
            {brand.brandName?.toUpperCase()}
          </h2>
          <button className="bip-close" onClick={onClose}>✕</button>
        </div>

        {/* CONTENT */}
        <div className="bip-content">

          {/* HOW TO REDEEM */}
          {redeemSteps.length > 0 && (
            <div className="bip-section">
              <h3 className="bip-heading">How to Redeem</h3>

              <ol className="bip-ol">
                {redeemSteps.map((step, i) => (
                  <li key={i}>{step.trim()}</li>
                ))}
              </ol>
            </div>
          )}

          {/* TERMS */}
          {terms.length > 0 && (
            <div className="bip-section">
              <h3 className="bip-heading">Terms & Conditions</h3>

              <ul className="bip-ul">
                {terms.map((t, i) => (
                  <li key={i}>{t.trim()}</li>
                ))}
              </ul>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default BrandInfoPopup;