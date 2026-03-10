// ✅ DetailsPop.jsx (NEW COMPONENT)
import React from "react";
import "./DetailsPop.css";
import DefaultProfile from "../../assets/DefaultProfile/DP.png";

export default function DetailsPop({
  open,
  onClose,
  details,
  profileImg = DefaultProfile,
}) {
  if (!open) return null;

  const {
    code = "TR******",
    value = 100.0,
    validity = "1 feb, 2026",
    status = "Active",
  } = details || {};

  const isActive = String(status).toLowerCase() === "active";

  const handleBackdrop = (e) => {
    if (e.target.classList.contains("dp-backdrop")) onClose?.();
  };

  return (
    <div className="dp-backdrop" onMouseDown={handleBackdrop}>
      <div className="dp-modal" role="dialog" aria-modal="true">
        <button className="dp-x" onClick={onClose} aria-label="Close popup">
          ✕
        </button>

        <div className="dp-profileWrap">
          <img src={profileImg} alt="Profile" className="dp-profile" />
        </div>

        <h2 className="dp-title">Voucher Details</h2>

        <div className="dp-card">
          <div className="dp-row dp-rowCode">
            <div className="dp-label">Code</div>

            <div className="dp-codeBox">
              <span className="dp-codeText">{code}</span>

              <button
                className="dp-copyBtn"
                title="Copy"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(code);
                  } catch (e) {}
                }}
              >
                📋
              </button>
            </div>
          </div>

          <div className="dp-divider" />

          <div className="dp-row">
            <div className="dp-label">Value</div>
            <div className="dp-value">₹{Number(value).toFixed(2)}</div>
          </div>

          <div className="dp-divider" />

          <div className="dp-row">
            <div className="dp-label">Validity</div>
            <div className="dp-value">{validity}</div>
          </div>

          <div className="dp-divider" />

          <div className="dp-row">
            <div className="dp-label">Status</div>
            <div className={`dp-pill ${isActive ? "active" : "inactive"}`}>
              {status}
            </div>
          </div>
        </div>

        <button className="dp-closeBtn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
