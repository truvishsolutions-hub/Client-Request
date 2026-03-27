// ✅ components/VoucherDetailsPopup/VoucherDetailsPopup.jsx (FINAL UPDATE - Removed Recipients, Added Validity)
import React from "react";
import "./VoucherDetailsPopup.css";
import logo from "../../assets/LOGO/TRV.png";

export default function VoucherDetailsPopup({
  isOpen,
  onClose,
  voucherCode,          // ✅ no hardcode
  value,
  validity,             // ✅ validity prop
  occasion,
  brands,
  onCopy,               // ✅ optional copy callback
}) {
  if (!isOpen) return null;

  const safeValue = Number(value ?? 0);

  const handleCopy = async () => {
    try {
      if (!voucherCode) return;
      await navigator.clipboard.writeText(voucherCode);
      onCopy?.(voucherCode);
    } catch (e) {
      onCopy?.(voucherCode);
    }
  };

  // Format validity date if provided
  const formatValidity = (validityData) => {
    if (!validityData) return "-";

    // If validity is already a formatted string like "6 Months"
    if (typeof validityData === 'string' && validityData.includes('Month')) {
      return validityData;
    }

    // If validity is a date
    try {
      const validDate = new Date(validityData);
      if (!isNaN(validDate.getTime())) {
        return validDate.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      }
    } catch (e) {
      return validityData;
    }

    return validityData;
  };

  return (
    <div className="vd-overlay" onClick={onClose}>
      <div className="vd-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close */}
        <button className="vd-close" onClick={onClose}>
          ✕
        </button>

        {/* Header */}
        <div className="vd-top">
          <img src={logo} alt="Logo" className="vd-logo" />
        </div>

        <h2 className="vd-title">Voucher Details</h2>

        {/* Code (click to copy) */}
        <button
          type="button"
          className="vd-code-pill"
          onClick={handleCopy}
          disabled={!voucherCode}
          aria-label="Copy voucher code"
          title={voucherCode ? "Tap to copy" : "No code"}
        >
          <div className="vd-code">{voucherCode || "—"}</div>
          <div className="vd-clip">📋</div>
        </button>

        {/* Rows */}
        <div className="vd-rows">
          <div className="vd-row">
            <div className="vd-left">Value</div>
            <div className="vd-right">₹{safeValue.toFixed(2)}</div>
          </div>

          <div className="vd-line" />

          <div className="vd-row">
            <div className="vd-left">Validity</div>
            <div className="vd-right">{formatValidity(validity)}</div>
          </div>

          <div className="vd-line" />

          <div className="vd-row">
            <div className="vd-left">Occasion</div>
            <div className="vd-right">{occasion?.name || occasion || "-"}</div>
          </div>

          <div className="vd-line" />

          <div className="vd-row vd-row-brands">
            <div className="vd-left">Brands</div>

            <div className="vd-brands">
              {brands?.length ? (
                brands.slice(0, 5).map((b, i) => (
                  <img key={i} src={b.img} alt={b.label} className="vd-brand-img" />
                ))
              ) : (
                <span className="vd-right">-</span>
              )}
            </div>
          </div>
        </div>

        {/* Done */}
        <button className="vd-done" onClick={onClose}>
          Done
        </button>

        {/* Footer */}
        <div className="vd-foot">
          <span>🔒</span>
          <span>This voucher is secure &amp; unique</span>
        </div>
      </div>
    </div>
  );
}