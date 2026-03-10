// ✅ Congratulation.jsx (FINAL UPDATE - Go to Truvish button removed)
import React from "react";
import "./Congratulation.css";
import logo from "../../assets/LOGO/TRV.png";

import { MdEmail } from "react-icons/md";
import { BsWhatsapp } from "react-icons/bs";
import { BiMessageRoundedDetail } from "react-icons/bi";

export default function Congratulation({
  voucherCode,
  onViewDetails,
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
              onClick={onShareGmail}
              disabled={!voucherCode}
            >
              <div className="cv-ico gmail">
                <MdEmail />
              </div>
              <div className="cv-share-text">Email</div>
            </button>

            <button
              className="cv-share-item"
              onClick={onShareWhatsApp}
              disabled={!voucherCode}
            >
              <div className="cv-ico whatsapp">
                <BsWhatsapp />
              </div>
              <div className="cv-share-text">WhatsApp</div>
            </button>

            <button
              className="cv-share-item"
              onClick={onShareSMS}
              disabled={!voucherCode}
            >
              <div className="cv-ico sms">
                <BiMessageRoundedDetail />
              </div>
              <div className="cv-share-text">SMS</div>
            </button>
          </div>

          {/* ✅ ONLY THIS BUTTON EXISTS NOW */}
          <button
            className="cv-btn-dark"
            onClick={onViewDetails}
            disabled={!voucherCode}
          >
            View details
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