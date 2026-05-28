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
    code = "-",
    validity = "-",
    status = "Issued",
    remainingBalance = 0,
    eventType = "",
    issuedDate = null,
    redeemHistory = [],
  } = details || {};

  const normalizedEventType = String(eventType || "")
    .trim()
    .toUpperCase();

  let pillClass = "active";
  let displayStatus = status;

  if (normalizedEventType === "FULL_REDEEM") {
    pillClass = "inactive";
    displayStatus = "Redeemed";
  } else if (normalizedEventType === "PARTIAL_REDEEM") {
    pillClass = "partial";
    displayStatus = "Partially Redeemed";
  } else {
    pillClass = "active";
    displayStatus = "Issued";
  }

  const formatDateTime = (value) => {
    if (!value) return "-";

    const d = new Date(value);

    if (Number.isNaN(d.getTime())) return "-";

    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getReadableStatus = (eventType) => {
    const type = String(eventType || "")
      .trim()
      .toUpperCase();

    if (type === "PARTIAL_REDEEM") {
      return "Partially Redeemed";
    }

    if (type === "FULL_REDEEM") {
      return "Redeemed";
    }

    return "";
  };

  const filteredHistory = redeemHistory.filter(
    (item) =>
      String(item?.eventType || "")
        .trim()
        .toUpperCase() !== "CODE_ASSIGNED"
  );

  const handleBackdrop = (e) => {
    if (e.target.classList.contains("dp-backdrop")) {
      onClose?.();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (e) {
      console.error("Copy failed:", e);
    }
  };

  return (
    <div
      className="dp-backdrop"
      onMouseDown={handleBackdrop}
    >
      <div className="dp-modal">

        {/* CLOSE */}

        <button
          className="dp-x"
          onClick={onClose}
        >
          ✕
        </button>

        {/* PROFILE */}

        <div className="dp-profileWrap">
          <img
            src={profileImg}
            alt="Profile"
            className="dp-profile"
          />
        </div>

        <h2 className="dp-title">
          Voucher Details
        </h2>

        {/* ===================================== */}
        {/* TOP DETAILS */}
        {/* ===================================== */}

        <div className="dp-card">

          {/* CODE */}

          <div className="dp-row">
            <div className="dp-label">
              Code
            </div>

            <div className="dp-codeBox">
              <span className="dp-codeText">
                {code}
              </span>

              <button
                className="dp-copyBtn"
                onClick={handleCopy}
              >
                📋
              </button>
            </div>
          </div>

          <div className="dp-divider" />

          {/* STATUS */}

          <div className="dp-row">
            <div className="dp-label">
              Status
            </div>

            <div
              className={`dp-pill ${pillClass}`}
            >
              {displayStatus}
            </div>
          </div>

          <div className="dp-divider" />

          {/* EXPIRY */}

          <div className="dp-row">
            <div className="dp-label">
              Expiry Date
            </div>

            <div className="dp-value">
              {validity}
            </div>
          </div>

          <div className="dp-divider" />

          {/* CURRENT BALANCE */}

          <div className="dp-row">
            <div className="dp-label">
              Current Balance
            </div>

            <div className="dp-value">
              ₹
              {Number(
                remainingBalance || 0
              ).toFixed(2)}
            </div>
          </div>

          <div className="dp-divider" />

          {/* ISSUED DATE */}

          <div className="dp-row">
            <div className="dp-label">
              Issued Date
            </div>

            <div className="dp-value">
              {formatDateTime(
                issuedDate
              )}
            </div>
          </div>

        </div>

        {/* ===================================== */}
        {/* REDEEM HISTORY */}
        {/* ===================================== */}

        <div className="dp-historyWrap">

          <div className="dp-historyTitle">
            Redeem History
          </div>

          <div className="dp-historyScroll">

            {filteredHistory.length === 0 && (
              <div className="dp-empty">
                No redeem history found
              </div>
            )}

            {filteredHistory.map(
              (item, index) => (
                <div
                  className="dp-historyCard"
                  key={index}
                >

                  {/* TOP */}

                  <div className="dp-historyTop">

                    <div
                      className="dp-historyStatus"
                    >
                      {`${getReadableStatus(
                        item?.eventType
                      )} Amount`}
                    </div>

                    <div
                      className="dp-historyAmount"
                    >
                      ₹
                      {Number(
                        item?.amount || 0
                      ).toFixed(2)}
                    </div>

                  </div>

                  {/* DATE */}

                  <div className="dp-historyRow">
                    <span>
                      Redeemed Date
                    </span>

                    <span>
                      {formatDateTime(
                        item?.eventTime
                      )}
                    </span>
                  </div>

                  {/* BRAND */}

                  <div className="dp-historyRow">
                    <span>
                      Redeemed Brand
                    </span>

                    <span>
                      {item?.redeemedBrand ||
                        "-"}
                    </span>
                  </div>

                  {/* PHONE */}

                  <div className="dp-historyRow">
                    <span>
                      Redeemed Number
                    </span>

                    <span>
                      {item?.redeemedPhone ||
                        "-"}
                    </span>
                  </div>

                </div>
              )
            )}

          </div>

        </div>

        {/* CLOSE BTN */}

        <button
          className="dp-closeBtn"
          onClick={onClose}
        >
          Close
        </button>

      </div>
    </div>
  );
}