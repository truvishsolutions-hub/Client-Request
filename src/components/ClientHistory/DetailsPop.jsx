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
    codeType = "DIGITAL",

    serialNumber = "-",
    referenceNumber = "-",

    value = 0,
    validity = "-",
    status = "Issued",
    remainingBalance = 0,

    eventType = "",
    issuedDate = null,
    redeemedDate = null,

    redeemedBrand = "-",
    redeemedPhone = "-",

    message = "",
    redeemHistory = [],
  } = details || {};

  const normalizedEventType =
    String(eventType || "")
      .trim()
      .toUpperCase();

  const normalizedCodeType =
    String(codeType || "DIGITAL")
      .trim()
      .toUpperCase();

  const isPhysical =
    normalizedCodeType === "PHYSICAL" ||
    normalizedCodeType === "TRUCARD" ||
    normalizedCodeType === "TRU_CARD";

  /* =========================================================
     STATUS PILL
  ========================================================= */

  let pillClass = "active";
  let displayStatus = "Issued";

  if (
    normalizedEventType === "FULL_REDEEM" ||
    normalizedEventType === "REDEEMED"
  ) {
    pillClass = "inactive";
    displayStatus = "Redeemed";
  } else if (
    normalizedEventType === "PARTIAL_REDEEM" ||
    normalizedEventType === "PARTIALLY_REDEEMED"
  ) {
    pillClass = "partial";
    displayStatus = "Partially Redeemed";
  } else if (
    normalizedEventType === "CANCELLED" ||
    normalizedEventType === "CANCELED"
  ) {
    pillClass = "inactive";
    displayStatus = "Cancelled";
  } else if (normalizedEventType === "EXPIRED") {
    pillClass = "inactive";
    displayStatus = "Expired";
  } else if (normalizedEventType === "DEACTIVATED") {
    pillClass = "inactive";
    displayStatus = "Inactive";
  } else {
    pillClass = "active";
    displayStatus = status || "Issued";
  }

  /* =========================================================
     DATE / TIME FORMAT
  ========================================================= */

  const formatDateTime = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* =========================================================
     AMOUNT FORMAT
  ========================================================= */

  const formatAmount = (amount) => {
    const number = Number(amount);
    if (!Number.isFinite(number)) return "0.00";
    return number.toFixed(2);
  };

  /* =========================================================
     CLEAN VALUE
  ========================================================= */

  const cleanValue = (value) => {
    const result = String(value ?? "").trim();
    if (
      !result ||
      result === "-" ||
      result.toUpperCase() === "NULL" ||
      result.toUpperCase() === "UNDEFINED"
    ) {
      return "";
    }
    return result;
  };

  /* =========================================================
     COPY TO CLIPBOARD
  ========================================================= */

  const copyText = async (value, label) => {
    try {
      if (!value || value === "-") return;
      await navigator.clipboard.writeText(String(value));
      console.log(`${label} copied:`, value);
    } catch (error) {
      console.error(`${label} copy failed:`, error);
    }
  };

  /* =========================================================
     BACKDROP CLOSE
  ========================================================= */

  const handleBackdrop = (event) => {
    if (event.target.classList.contains("dp-backdrop")) {
      onClose?.();
    }
  };

  /* =========================================================
     HISTORY HELPERS – use `_code` if available
  ========================================================= */

  const getHistoryCode = (item) => {
    // Prefer the already normalized _code from parent
    if (item?._code && item._code !== "-") {
      return item._code;
    }

    const candidates = [
      item?.userTruvishCode,
      item?.userTruvishCodeNumber,
      item?.truvishIdCodeNumber,
      item?.truvishCode,
      item?.digitalCode,
      item?.digitalCodeNumber,
      item?.voucherCode,
      item?.assignedCode,
      item?.assignedDigitalCode,
      item?.code,
      item?.codeNumber,
    ];
    for (const value of candidates) {
      const code = cleanValue(value);
      if (code) return code;
    }

    // Fallback: if physical and no code found, return the main code (from details)
    const itemType = String(item?.codeType || item?.voucherType || item?.cardType || "")
      .trim()
      .toUpperCase();
    if (itemType.includes("PHYSICAL") || itemType.includes("TRUCARD")) {
      return code; // use the main code
    }
    return "-";
  };

  const getHistorySerial = (item) =>
    item?.serialNumber ||
    item?.serialNo ||
    item?.truCardSerialNumber ||
    item?.truCardSerial ||
    item?.cardSerialNumber ||
    item?.physicalSerialNumber ||
    "-";

  const getHistoryReference = (item) =>
    item?.referenceNumber ||
    item?.referenceNo ||
    item?.refNumber ||
    item?.truCardReferenceNumber ||
    item?.truCardReference ||
    item?.reference ||
    "-";

  const getHistoryAmount = (item) =>
    item?.amount ??
    item?.value ??
    item?.denomination ??
    item?.userBrandValue ??
    item?.truvishCodeValue ??
    item?.originalAmount ??
    0;

  const getHistoryBrand = (item) =>
    item?.userBrandName ||
    item?.redeemedBrand ||
    item?.redeemBrand ||
    item?.brand ||
    item?.brandName ||
    "-";

  const getHistoryPhone = (item) =>
    item?.userPhoneNumber ||
    item?.redeemedPhone ||
    item?.redeemedNumber ||
    item?.mobileNumber ||
    item?.phone ||
    "-";

  const getHistoryDate = (item) =>
    item?.userBrandTimeTemp ||
    item?.eventTime ||
    item?.redeemedDate ||
    item?.redeemDate ||
    item?.redeemedAt ||
    item?.activatedAt ||
    item?.updatedAt ||
    item?.createdAt ||
    item?.issuedDate ||
    item?.assignedDate ||
    null;

  const getHistoryRemainingBalance = (item) =>
    item?.clientBalanceAfterActivation ??
    item?.remainingBalance ??
    item?.currentBalance ??
    item?.balanceAfter ??
    item?.afterBalance ??
    item?.after_balance ??
    null;

  const getHistoryMessage = (item) => {
    const candidates = [
      item?.historyMessage,
      item?.history_message,
      item?.message,
      item?.description,
      item?.transactionMessage,
      item?.eventMessage,
      item?.redemptionMessage,
      item?.redemption_message,
      item?.statusMessage,
      item?.status_message,
      item?.activityMessage,
      item?.activity_message,
      item?.userMessage,
      item?.user_message,
    ];
    for (const value of candidates) {
      const msg = cleanValue(value);
      if (msg) return msg;
    }

    const type = String(
      item?.eventType || item?.statusEvent || item?.transactionType || item?.action || item?.status || ""
    )
      .trim()
      .toUpperCase();
    const itemType = String(
      item?.codeType || item?.voucherType || item?.cardType || item?.source || ""
    )
      .trim()
      .toUpperCase();
    const physical = itemType.includes("PHYSICAL") || itemType.includes("TRUCARD");

    if (type === "ACTIVE" || type === "ACTIVATED") {
      return physical ? "Physical TruCard activated" : "Digital code activated";
    }
    if (type === "REDEEMED" || type === "FULL_REDEEM") {
      return physical ? "Physical TruCard redeemed" : "Digital code redeemed";
    }
    if (type === "PARTIAL_REDEEM" || type === "PARTIALLY_REDEEMED") {
      return physical ? "Physical TruCard partially redeemed" : "Digital code partially redeemed";
    }
    if (type === "CANCELLED" || type === "CANCELED") {
      return physical ? "Physical TruCard cancelled" : "Digital code cancelled";
    }
    if (type === "DEACTIVATED") {
      return physical ? "Physical TruCard deactivated" : "Digital code deactivated";
    }
    if (type === "EXPIRED") {
      return physical ? "Physical TruCard expired" : "Digital code expired";
    }
    return physical ? "Physical TruCard issued" : "Digital code issued";
  };

  const getReadableStatus = (historyEventType, historyStatus) => {
    const type = String(historyEventType || "").trim().toUpperCase();
    const statusValue = String(historyStatus || "").trim().toUpperCase();

    if (type === "PARTIAL_REDEEM" || type === "PARTIALLY_REDEEMED") return "Partially Redeemed";
    if (type === "FULL_REDEEM" || type === "REDEEMED" || statusValue === "REDEEMED") return "Redeemed";
    if (type === "CANCELLED" || type === "CANCELED" || statusValue === "CANCELLED" || statusValue === "CANCELED")
      return "Cancelled";
    if (type === "EXPIRED" || statusValue === "EXPIRED") return "Expired";
    if (type === "DEACTIVATED" || statusValue === "DEACTIVATED" || statusValue === "INACTIVE")
      return "Inactive";
    if (type === "ACTIVE" || type === "ACTIVATED" || statusValue === "ACTIVE") return "Active";
    if (type === "CODE_ASSIGNED" || type === "ASSIGNED" || type === "ISSUED") return "Issued";
    return historyEventType || historyStatus || "Transaction";
  };

  /* =========================================================
     FILTER HISTORY – exclude assignment events
  ========================================================= */

  const filteredHistory = Array.isArray(redeemHistory)
    ? redeemHistory.filter((item) => {
        const type = String(
          item?.eventType || item?.statusEvent || item?.transactionType || item?.action || ""
        )
          .trim()
          .toUpperCase();
        return type !== "CODE_ASSIGNED" && type !== "ASSIGNED" && type !== "ISSUED";
      })
    : [];

  return (
    <div className="dp-backdrop" onMouseDown={handleBackdrop}>
      <div className="dp-modal">
        <button
          type="button"
          className="dp-x"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        <div className="dp-profileWrap">
          <img
            src={profileImg || DefaultProfile}
            alt="Profile"
            className="dp-profile"
          />
        </div>

        <h2 className="dp-title">Voucher Details</h2>

        <div className="dp-typeBadgeWrap">
          <span className={`dp-typeBadge ${isPhysical ? "physical" : "digital"}`}>
            {isPhysical ? "Physical / TruCard" : "Digital Code"}
          </span>
        </div>

        <div className="dp-card">
          {/* CODE */}
          <div className="dp-row">
            <div className="dp-label">Code</div>
            <div className="dp-codeBox">
              <span className="dp-codeText">{code}</span>
              <button
                type="button"
                className="dp-copyBtn"
                onClick={() => copyText(code, "Voucher code")}
                title="Copy code"
              >
                📋
              </button>
            </div>
          </div>

          <div className="dp-divider" />

          {/* SERIAL (physical only) */}
          {isPhysical && (
            <>
              <div className="dp-row">
                <div className="dp-label">Serial Number</div>
                <div className="dp-codeBox">
                  <span className="dp-codeText">{serialNumber}</span>
                  {serialNumber !== "-" && (
                    <button
                      type="button"
                      className="dp-copyBtn"
                      onClick={() => copyText(serialNumber, "Serial number")}
                      title="Copy serial number"
                    >
                      📋
                    </button>
                  )}
                </div>
              </div>
              <div className="dp-divider" />
            </>
          )}

          {/* REFERENCE (if available) */}
          {referenceNumber && referenceNumber !== "-" && (
            <>
              <div className="dp-row">
                <div className="dp-label">Reference Number</div>
                <div className="dp-codeBox">
                  <span className="dp-codeText">{referenceNumber}</span>
                  <button
                    type="button"
                    className="dp-copyBtn"
                    onClick={() => copyText(referenceNumber, "Reference number")}
                    title="Copy reference"
                  >
                    📋
                  </button>
                </div>
              </div>
              <div className="dp-divider" />
            </>
          )}

          {/* VALUE */}
          <div className="dp-row">
            <div className="dp-label">Voucher Value</div>
            <div className="dp-value">₹{formatAmount(value)}</div>
          </div>

          <div className="dp-divider" />

          {/* STATUS */}
          <div className="dp-row">
            <div className="dp-label">Status</div>
            <div className={`dp-pill ${pillClass}`}>{displayStatus}</div>
          </div>

          <div className="dp-divider" />

          {/* EXPIRY */}
          <div className="dp-row">
            <div className="dp-label">Expiry Date</div>
            <div className="dp-value">{validity}</div>
          </div>

          <div className="dp-divider" />

          {/* REMAINING BALANCE */}
          <div className="dp-row">
            <div className="dp-label">Current Balance</div>
            <div className="dp-value">₹{formatAmount(remainingBalance)}</div>
          </div>

          <div className="dp-divider" />

          {/* ISSUED DATE */}
          <div className="dp-row">
            <div className="dp-label">Issued Date</div>
            <div className="dp-value">{formatDateTime(issuedDate)}</div>
          </div>

          {redeemedDate && (
            <>
              <div className="dp-divider" />
              <div className="dp-row">
                <div className="dp-label">Redeemed Date</div>
                <div className="dp-value">{formatDateTime(redeemedDate)}</div>
              </div>
            </>
          )}

          {redeemedBrand && redeemedBrand !== "-" && (
            <>
              <div className="dp-divider" />
              <div className="dp-row">
                <div className="dp-label">Redeemed Brand</div>
                <div className="dp-value">{redeemedBrand}</div>
              </div>
            </>
          )}

          {redeemedPhone && redeemedPhone !== "-" && (
            <>
              <div className="dp-divider" />
              <div className="dp-row">
                <div className="dp-label">Redeemed Number</div>
                <div className="dp-value">{redeemedPhone}</div>
              </div>
            </>
          )}
        </div>

        {message && (
          <div className="dp-messageBox">
            <div className="dp-messageTitle">Information</div>
            <div className="dp-messageText">{message}</div>
          </div>
        )}

        <div className="dp-historyWrap">
          <div className="dp-historyTitle">Redeem History</div>
          <div className="dp-historyScroll">
            {filteredHistory.length === 0 && (
              <div className="dp-empty">No redeem history found</div>
            )}
            {filteredHistory.map((item, index) => {
              const historyEvent = item?.eventType || item?.statusEvent || item?.transactionType || item?.action || "";
              const historyStatus = item?.status || item?.redeemStatus || "";
              const readableStatus = getReadableStatus(historyEvent, historyStatus);
              const historyBalance = getHistoryRemainingBalance(item);

              return (
                <div
                  className="dp-historyCard"
                  key={`${getHistoryCode(item)}-${index}`}
                >
                  <div className="dp-historyTop">
                    <div className="dp-historyStatus">{readableStatus}</div>
                    <div className="dp-historyAmount">
                      ₹{formatAmount(getHistoryAmount(item))}
                    </div>
                  </div>

                  <div className="dp-historyRow">
                    <span>Code</span>
                    <span>{getHistoryCode(item)}</span>
                  </div>

                  {isPhysical && (
                    <div className="dp-historyRow">
                      <span>Serial Number</span>
                      <span>{getHistorySerial(item)}</span>
                    </div>
                  )}

                  {isPhysical && getHistoryReference(item) !== "-" && (
                    <div className="dp-historyRow">
                      <span>Reference Number</span>
                      <span>{getHistoryReference(item)}</span>
                    </div>
                  )}

                  <div className="dp-historyRow">
                    <span>Transaction Date</span>
                    <span>{formatDateTime(getHistoryDate(item))}</span>
                  </div>

                  <div className="dp-historyRow">
                    <span>Redeemed Brand</span>
                    <span>{getHistoryBrand(item)}</span>
                  </div>

                  <div className="dp-historyRow">
                    <span>Redeemed Number</span>
                    <span>{getHistoryPhone(item)}</span>
                  </div>

                  {historyBalance !== null && (
                    <div className="dp-historyRow">
                      <span>Remaining Balance</span>
                      <span>₹{formatAmount(historyBalance)}</span>
                    </div>
                  )}

                  <div className="dp-historyRow">
                    <span>Message</span>
                    <span>{getHistoryMessage(item)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button type="button" className="dp-closeBtn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}