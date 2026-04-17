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
    validity = "-",
    status = "Issued",
    remainingBalance = 0,
    eventType = "",
    message = "",
    eventTime = null
  } = details || {};

  const normalizedEventType = String(eventType || "").trim().toUpperCase();

  let pillClass = "active";
  let displayStatus = status;

  if (normalizedEventType === "FULL_REDEEM") {
    pillClass = "inactive";
    displayStatus = "Redeemed";
  } else if (normalizedEventType === "PARTIAL_REDEEM") {
    pillClass = "partial";
    displayStatus = "Partially Redeemed";
  } else if (normalizedEventType === "CODE_ASSIGNED") {
    pillClass = "active";
    displayStatus = "Issued";
  }

  const formatDateTime = (value) => {
    if (!value) return "-";

    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "-";

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);

    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    if (hours === 0) hours = 12;

    return `${day}/${month}/${year} ${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
  };

  const handleBackdrop = (e) => {
    if (e.target.classList.contains("dp-backdrop")) onClose?.();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (e) {
      console.error("Failed to copy:", e);
    }
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
                onClick={handleCopy}
              >
                📋
              </button>
            </div>
          </div>

          <div className="dp-divider" />

          <div className="dp-row">
            <div className="dp-label">Amount</div>
            <div className="dp-value">₹{Number(value || 0).toFixed(2)}</div>
          </div>

          <div className="dp-divider" />

          <div className="dp-row">
            <div className="dp-label">Remaining Balance</div>
            <div className="dp-value">₹{Number(remainingBalance || 0).toFixed(2)}</div>
          </div>

          <div className="dp-divider" />

          <div className="dp-row">
            <div className="dp-label">Date</div>
            <div className="dp-value">{formatDateTime(eventTime)}</div>
          </div>

          <div className="dp-divider" />

          <div className="dp-row">
            <div className="dp-label">Expiry Date</div>
            <div className="dp-value">{validity}</div>
          </div>

          <div className="dp-divider" />

          <div className="dp-row">
            <div className="dp-label">Message</div>
            <div className="dp-value">{message || "-"}</div>
          </div>

          <div className="dp-divider" />

          <div className="dp-row">
            <div className="dp-label">Status</div>
            <div className={`dp-pill ${pillClass}`}>
              {displayStatus}
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