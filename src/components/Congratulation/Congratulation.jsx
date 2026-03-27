// ✅ Congratulation.jsx (FINAL UPDATE - WhatsApp icon click fixed, no movement)
import React from "react";
import "./Congratulation.css";
import logo from "../../assets/LOGO/TRV.png";

import { MdEmail } from "react-icons/md";
import { BsWhatsapp } from "react-icons/bs";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { TbLocationCode } from "react-icons/tb";

export default function Congratulation({
  voucherCode,
  onViewDetails,
  onRedeemNow,
  onShareGmail,
  onShareWhatsApp,
  onShareSMS,
  onCopy,
}) {
  const handleCopy = async () => {
    try {
      if (!voucherCode) return;
      await navigator.clipboard.writeText(voucherCode);
      onCopy?.(voucherCode);
    } catch (e) {
      onCopy?.(voucherCode);
    }
  };

  // Prevent any default behavior and stop propagation
  const handleShareClick = (callback) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (callback && voucherCode) {
      callback();
    }
    return false;
  };

  return (
    <div className="cv-page">
      <div className="cv-wrap">
        <div className="cv-header">
          <img src={logo} alt="Logo" className="cv-logo" />
        </div>

        <h1 className="cv-title">Congratulations!</h1>

        <div className="cv-panel">
          <div className="cv-label">Your voucher code is</div>

          <button
            className="cv-code"
            type="button"
            onClick={handleCopy}
            disabled={!voucherCode}
          >
            <span className="cv-code-text">{voucherCode || "Loading..."}</span>
            <span className="cv-copy">📋</span>
          </button>

          <div className="cv-share">
            <button
              className="cv-share-item"
              onClick={handleShareClick(onShareGmail)}
              disabled={!voucherCode}
              type="button"
            >
              <div className="cv-ico gmail">
                <MdEmail />
              </div>
              <div className="cv-share-text">Email</div>
            </button>

            <button
              className="cv-share-item"
              onClick={handleShareClick(onShareWhatsApp)}
              disabled={!voucherCode}
              type="button"
            >
              <div className="cv-ico whatsapp">
                <BsWhatsapp />
              </div>
              <div className="cv-share-text">WhatsApp</div>
            </button>

            <button
              className="cv-share-item"
              onClick={handleShareClick(onShareSMS)}
              disabled={!voucherCode}
              type="button"
            >
              <div className="cv-ico sms">
                <BiMessageRoundedDetail />
              </div>
              <div className="cv-share-text">SMS</div>
            </button>
          </div>

          {/* View details button */}
          <button
            className="cv-btn-dark"
            onClick={onViewDetails}
            disabled={!voucherCode}
            type="button"
          >
            View details
          </button>

          {/* Redeem Now button with icon */}
          <button
            className="cv-btn-redeem"
            onClick={onRedeemNow}
            disabled={!voucherCode}
            type="button"
          >
            <TbLocationCode className="cv-redeem-icon" />
            <span>Redeem Now</span>
          </button>
        </div>

        <div className="cv-foot">
          <span className="cv-lock">🔒</span>
          <span>This voucher is secure &amp; unique</span>
        </div>
      </div>
    </div>
  );
}