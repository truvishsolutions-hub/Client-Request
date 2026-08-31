import React, { useEffect, useMemo, useState } from "react";
import "./ClientHistory.css";
import DefaultProfile from "../../assets/DefaultProfile/DP.png";
import DetailsPop from "./DetailsPop";
import { IoChevronBack } from "react-icons/io5";

// const BASE_URL =
//   import.meta.env.VITE_API_URL || "http://localhost:8080";

  // const BASE_URL =
  //   import.meta.env.VITE_API_URL || "https://truvish-backend-production.up.railway.app";
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://api.truvish.com";



const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

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

const getTime = (value) => {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : 0;
};

const formatAmount = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

// ============================================================
// CODE TYPE DETECTION
// ============================================================

const getCodeType = (item) => {
  const explicitType = normalize(
    item?.codeType ||
      item?.voucherType ||
      item?.cardType ||
      item?.source ||
      item?.codeSource ||
      item?.code_type ||
      item?.type
  );

  if (
    explicitType.includes("PHYSICAL") ||
    explicitType.includes("TRUCARD") ||
    explicitType.includes("TRU_CARD") ||
    explicitType.includes("TRUBLANK") ||
    explicitType.includes("TRU_BLANK")
  ) {
    return "PHYSICAL";
  }

  if (
    explicitType.includes("DIGITAL") ||
    explicitType.includes("TRUVISH")
  ) {
    return "DIGITAL";
  }

  if (
    item?.truBlankCodeId != null ||
    item?.serialNumber != null ||
    item?.serialNo != null ||
    item?.truCardSerialNumber != null ||
    item?.truCardSerial != null ||
    item?.cardSerialNumber != null ||
    item?.physicalSerialNumber != null ||
    item?.truBlankCode != null ||
    item?.referenceNumber != null ||
    item?.referenceNo != null ||
    item?.truCardReferenceNumber != null ||
    item?.truCardReference != null ||
    item?.denomination != null ||
    item?.blankCodeStatus != null ||
    item?.clientBalanceBeforeActivation != null ||
    item?.clientBalanceAfterActivation != null
  ) {
    return "PHYSICAL";
  }

  return "DIGITAL";
};

// ============================================================
// EXTRACT DIGITAL CODE
// ============================================================

const getDigitalCode = (item) => {
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
  return "-";
};

// ============================================================
// DISPLAY CODE – returns actual code for both types
// ============================================================

const getCode = (item) => {
  const type = getCodeType(item);
  if (type === "PHYSICAL") {
    // For physical, use codeNumber (or fallback to other fields)
    return (
      cleanValue(item?.codeNumber) ||
      cleanValue(item?.truvishIdCodeNumber) ||
      cleanValue(item?.code) ||
      cleanValue(item?.truvishCode) ||
      "-"
    );
  }
  // Digital
  return getDigitalCode(item);
};

// ============================================================
// SERIAL / REFERENCE
// ============================================================

const getSerialNumber = (item) =>
  cleanValue(
    item?.serialNumber ||
      item?.serialNo ||
      item?.truCardSerialNumber ||
      item?.truCardSerial ||
      item?.cardSerialNumber ||
      item?.physicalSerialNumber ||
      item?.truvishSerialNumber
  );

const getReferenceNumber = (item) =>
  cleanValue(
    item?.referenceNumber ||
      item?.referenceNo ||
      item?.refNumber ||
      item?.truCardReferenceNumber ||
      item?.truCardReference ||
      item?.reference
  );

// ============================================================
// DATABASE ID
// ============================================================

const getDatabaseId = (item) =>
  item?.truBlankCodeId ??
  item?.userId ??
  item?.id ??
  item?.truvishId ??
  item?.truCardId ??
  null;

// ============================================================
// EVENT TYPE
// ============================================================

const getEventType = (item) =>
  item?.redemptionProcess ||
  item?.eventType ||
  item?.statusEvent ||
  item?.transactionType ||
  item?.action ||
  item?.historyType ||
  item?.event ||
  item?.status ||
  item?.blankCodeStatus ||
  "CODE_ASSIGNED";

// ============================================================
// EVENT DATE
// ============================================================

const getEventDate = (item) =>
  item?.userBrandTimeTemp ||
  item?.redeemedAt ||
  item?.activatedAt ||
  item?.updatedAt ||
  item?.createdAt ||
  item?.eventTime ||
  item?.activationDate ||
  item?.redeemedDate ||
  item?.redeemDate ||
  item?.issuedDate ||
  item?.assignedDate ||
  item?.generatedDate ||
  item?.date ||
  item?.timestamp ||
  null;

// ============================================================
// AMOUNT
// ============================================================

const getAmount = (item) =>
  item?.denomination ??
  item?.userBrandValue ??
  item?.amount ??
  item?.value ??
  item?.truvishCodeValue ??
  item?.originalAmount ??
  item?.originalCodeValue ??
  0;

// ============================================================
// REMAINING BALANCE
// ============================================================

const getRemainingBalance = (item) =>
  item?.clientBalanceAfterActivation ??
  item?.afterBalance ??
  item?.remainingBalance ??
  item?.currentBalance ??
  item?.balanceAfter ??
  item?.after_balance ??
  item?.clientBalance ??
  0;

// ============================================================
// EXPIRY
// ============================================================

const getExpiryDate = (item) =>
  item?.expiryDate ||
  item?.validityDate ||
  item?.validUntil ||
  item?.expiry ||
  item?.expiresAt ||
  item?.userBrandValidity ||
  item?.validity ||
  null;

// ============================================================
// VALIDITY MONTHS
// ============================================================

const getValidityMonths = (item) =>
  item?.validityMonths ?? item?.validityPeriod ?? null;

// ============================================================
// BRAND
// ============================================================

const getBrand = (item) => {
  const brand =
    item?.userBrandName ||
    item?.redeemedBrand ||
    item?.redeemBrand ||
    item?.brand ||
    item?.brandName;
  if (brand) return brand;
  if (Array.isArray(item?.brandNames)) {
    return item.brandNames.join(", ");
  }
  if (Array.isArray(item?.clientBrand)) {
    return item.clientBrand.join(", ");
  }
  if (typeof item?.clientBrand === "string") {
    return item.clientBrand;
  }
  return "-";
};

// ============================================================
// PHONE
// ============================================================

const getPhone = (item) =>
  item?.userPhoneNumber ||
  item?.redeemedPhone ||
  item?.redeemedNumber ||
  item?.mobileNumber ||
  item?.phone ||
  "-";

// ============================================================
// MESSAGE
// ============================================================

const getMessage = (item) => {
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
    const message = cleanValue(value);
    if (message) return message;
  }
  return "";
};

// ============================================================
// STATUS
// ============================================================

const getStatus = (item) =>
  item?.redeemStatus ||
  item?.blankCodeStatus ||
  item?.status ||
  item?.truvishCodeStatus ||
  item?.codeStatus ||
  item?.redeem_status ||
  "";

// ============================================================
// CLIENT ID
// ============================================================

const getClientId = (item) => item?.clientId ?? item?.client_id ?? null;

// ============================================================
// ARRAY EXTRACTOR
// ============================================================

const extractArray = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.content)) return response.content;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.history)) return response.history;
  if (Array.isArray(response?.transactions)) return response.transactions;
  return [];
};

// ============================================================
// COMPONENT
// ============================================================

export default function ClientHistory({
  onBack,
  clientId,
  clientName,
  clientBalance,
  profileImg,
}) {
  const [activeTab, setActiveTab] = useState("history");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [openPop, setOpenPop] = useState(false);
  const [selected, setSelected] = useState(null);
  const [liveBalance, setLiveBalance] = useState(clientBalance ?? 0);

  useEffect(() => {
    setLiveBalance(clientBalance ?? 0);
  }, [clientBalance]);

  // Live balance poll
  useEffect(() => {
    if (!clientId) return;
    let mounted = true;
    const fetchBalance = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/clients/${clientId}`);
        if (!response.ok) return;
        const data = await response.json();
        if (mounted && data?.balance !== undefined && data?.balance !== null) {
          setLiveBalance(data.balance);
        }
      } catch (error) {
        console.error("Client balance fetch failed:", error);
      }
    };
    fetchBalance();
    const interval = setInterval(fetchBalance, 5000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [clientId]);

  // Fetch history
  useEffect(() => {
    if (!clientId) {
      setHistory([]);
      setHistoryError("Client ID is required to load history.");
      return;
    }
    let mounted = true;
    const fetchHistory = async () => {
      setLoading(true);
      setHistoryError("");
      try {
        const response = await fetch(
          `${BASE_URL}/api/redemption-history/client/${clientId}`
        );
        if (!response.ok) {
          throw new Error(`Unable to load client history (${response.status}).`);
        }
        const json = await response.json();
        const result = extractArray(json);
        if (!mounted) return;
        setHistory(result);
        if (result.length === 0) {
          setHistoryError("No transaction history found for this client.");
        }
      } catch (error) {
        console.error("History loading failed:", error);
        if (mounted) {
          setHistory([]);
          setHistoryError(error?.message || "Unable to load client history.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchHistory();
    return () => {
      mounted = false;
    };
  }, [clientId]);

  // Normalize history items
  const normalizedHistory = useMemo(() => {
    return history.map((item, index) => {
      const codeType = getCodeType(item);
      const code = getCode(item);
      return {
        ...item,
        _index: index,
        _code: code,
        _codeType: codeType,
        _eventType: getEventType(item),
        _eventDate: getEventDate(item),
        _amount: getAmount(item),
        _remainingBalance: getRemainingBalance(item),
        _expiryDate: getExpiryDate(item),
        _validityMonths: getValidityMonths(item),
        _brand: getBrand(item),
        _phone: getPhone(item),
        _message: getMessage(item),
        _status: getStatus(item),
        _clientId: getClientId(item),
        _serialNumber: getSerialNumber(item),
        _referenceNumber: getReferenceNumber(item),
        _databaseId: getDatabaseId(item),
      };
    });
  }, [history]);

  // Deduplicate by unique key
  const uniqueHistory = useMemo(() => {
    const latestMap = new Map();
    normalizedHistory.forEach((item) => {
      let uniqueKey;
      if (item._codeType === "PHYSICAL") {
        uniqueKey = [
          "PHYSICAL",
          item._databaseId ?? "",
          item._serialNumber ?? "",
          item._referenceNumber ?? "",
        ].join("|");
        if (uniqueKey === "PHYSICAL|||") {
          uniqueKey = `PHYSICAL_INDEX_${item._index}`;
        }
      } else {
        const digitalCode = String(item._code ?? "").trim();
        if (!digitalCode || digitalCode === "-") {
          uniqueKey = `DIGITAL_INDEX_${item._index}`;
        } else {
          uniqueKey = `DIGITAL|${digitalCode}`;
        }
      }
      const currentTime = getTime(item._eventDate);
      const existing = latestMap.get(uniqueKey);
      if (!existing || currentTime > getTime(existing._eventDate)) {
        latestMap.set(uniqueKey, item);
      }
    });
    return Array.from(latestMap.values()).sort(
      (a, b) => getTime(b._eventDate) - getTime(a._eventDate)
    );
  }, [normalizedHistory]);

  // Dot colour
  const getDotClass = (eventType, codeType, status) => {
    const type = normalize(eventType);
    const normalizedStatus = normalize(status);
    if (
      type === "PARTIAL_REDEEM" ||
      type === "PARTIALLY_REDEEMED"
    ) {
      return "orange";
    }
    if (
      type === "FULL_REDEEM" ||
      type === "REDEEMED" ||
      normalizedStatus === "REDEEMED"
    ) {
      return "red";
    }
    if (
      type === "CANCELLED" ||
      type === "CANCELED" ||
      type === "DEACTIVATED" ||
      type === "EXPIRED" ||
      normalizedStatus === "CANCELLED" ||
      normalizedStatus === "CANCELED" ||
      normalizedStatus === "EXPIRED"
    ) {
      return "red";
    }
    return "green";
  };

  // Readable status
  const getReadableStatus = (eventType, codeType, status) => {
    const type = normalize(eventType);
    const normalizedStatus = normalize(status);
    if (
      type === "PARTIAL_REDEEM" ||
      type === "PARTIALLY_REDEEMED"
    ) {
      return "Partially Redeemed";
    }
    if (
      type === "FULL_REDEEM" ||
      type === "REDEEMED" ||
      normalizedStatus === "REDEEMED"
    ) {
      return "Redeemed";
    }
    if (
      normalizedStatus === "CANCELLED" ||
      normalizedStatus === "CANCELED" ||
      type === "CANCELLED" ||
      type === "CANCELED"
    ) {
      return "Cancelled";
    }
    if (normalizedStatus === "EXPIRED" || type === "EXPIRED") {
      return "Expired";
    }
    if (
      normalizedStatus === "INACTIVE" ||
      normalizedStatus === "DEACTIVATED" ||
      type === "DEACTIVATED"
    ) {
      return "Inactive";
    }
    if (
      normalizedStatus === "ACTIVE" ||
      normalizedStatus === "ACTIVATED" ||
      type === "ACTIVE" ||
      type === "ACTIVATED"
    ) {
      return "Active";
    }
    if (
      type === "ASSIGNED" ||
      type === "CODE_ASSIGNED" ||
      type === "ISSUED"
    ) {
      return "Issued";
    }
    return "Issued";
  };

  // Display message for list
  const getDisplayMessage = (row) => {
    if (row?._message) return row._message;
    const type = normalize(row?._eventType);
    const status = normalize(row?._status);
    if (
      type === "ACTIVE" ||
      type === "ACTIVATED" ||
      status === "ACTIVE"
    ) {
      return row._codeType === "PHYSICAL"
        ? "TruCard activated"
        : "Digital code activated";
    }
    if (type === "REDEEMED" || type === "FULL_REDEEM") {
      return row._codeType === "PHYSICAL"
        ? "TruCard redeemed"
        : "Digital code redeemed";
    }
    if (
      type === "PARTIAL_REDEEM" ||
      type === "PARTIALLY_REDEEMED"
    ) {
      return row._codeType === "PHYSICAL"
        ? "TruCard partially redeemed"
        : "Digital code partially redeemed";
    }
    if (type === "CANCELLED" || type === "CANCELED") {
      return row._codeType === "PHYSICAL"
        ? "TruCard cancelled"
        : "Digital code cancelled";
    }
    if (type === "DEACTIVATED") {
      return row._codeType === "PHYSICAL"
        ? "TruCard deactivated"
        : "Digital code deactivated";
    }
    if (type === "EXPIRED") {
      return row._codeType === "PHYSICAL"
        ? "TruCard expired"
        : "Digital code expired";
    }
    return row._codeType === "PHYSICAL"
      ? "TruCard assigned"
      : "Code assigned";
  };

  // Format date
  const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  // Open details popup
  const openDetails = (row) => {
    const sameCodeHistory = normalizedHistory
      .filter((item) => {
        if (item._codeType !== row._codeType) return false;
        if (row._codeType === "PHYSICAL") {
          if (row._databaseId != null && item._databaseId != null) {
            return String(item._databaseId) === String(row._databaseId);
          }
          if (row._serialNumber && item._serialNumber) {
            return String(item._serialNumber).trim() === String(row._serialNumber).trim();
          }
          if (row._referenceNumber && item._referenceNumber) {
            return String(item._referenceNumber).trim() === String(row._referenceNumber).trim();
          }
          return false;
        }
        return String(item._code).trim() === String(row._code).trim();
      })
      .sort((a, b) => getTime(b._eventDate) - getTime(a._eventDate));

    const latest = sameCodeHistory[0] || row;

    setSelected({
      id: row._databaseId,
      code: row._code,
      codeType: row._codeType,
      truBlankCodeId: row?.truBlankCodeId ?? latest?.truBlankCodeId ?? null,
      serialNumber: row._serialNumber || latest?._serialNumber || "-",
      referenceNumber: row._referenceNumber || latest?._referenceNumber || "-",
      value: row._amount,
      amount: row._amount,
      denomination: row?.denomination ?? latest?.denomination ?? row._amount,
      validity: formatDate(row._expiryDate),
      validityMonths: row._validityMonths,
      expiryDate: row._expiryDate,
      status: getReadableStatus(row._eventType, row._codeType, row._status),
      rawStatus: row._status,
      blankCodeStatus: row?.blankCodeStatus ?? latest?.blankCodeStatus ?? null,
      eventType: row._eventType,
      redemptionProcess: row?.redemptionProcess ?? row._eventType,
      redeemedBrand: row._brand,
      userBrandName: row?.userBrandName ?? latest?.userBrandName ?? row._brand,
      userBrandVoucher: row?.userBrandVoucher ?? latest?.userBrandVoucher ?? null,
      userBrandPin: row?.userBrandPin ?? latest?.userBrandPin ?? null,
      redeemedPhone: row._phone,
      userPhoneNumber: row?.userPhoneNumber ?? latest?.userPhoneNumber ?? null,
      issuedDate: row?.createdAt ?? row?.issuedDate ?? row?.assignedDate ?? row?._eventDate ?? null,
      createdAt: row?.createdAt ?? latest?.createdAt ?? null,
      updatedAt: row?.updatedAt ?? latest?.updatedAt ?? null,
      activatedAt: row?.activatedAt ?? latest?.activatedAt ?? null,
      activatedBy: row?.activatedBy ?? latest?.activatedBy ?? null,
      redeemedDate: row?.redeemedAt ?? row?.redeemedDate ?? row?.redeemDate ?? null,
      redeemedAt: row?.redeemedAt ?? latest?.redeemedAt ?? null,
      createdBy: row?.createdBy ?? latest?.createdBy ?? null,
      clientId: row?._clientId ?? latest?._clientId ?? clientId ?? null,
      clientName: row?.clientName ?? latest?.clientName ?? clientName ?? null,
      clientCompanyName: row?.clientCompanyName ?? latest?.clientCompanyName ?? clientName ?? null,
      clientImg: row?.clientImg ?? latest?.clientImg ?? profileImg ?? null,
      clientCategory: row?.clientCategory ?? latest?.clientCategory ?? null,
      clientTheme: row?.clientTheme ?? latest?.clientTheme ?? null,
      clientThemeImg: row?.clientThemeImg ?? latest?.clientThemeImg ?? null,
      clientBrand: Array.isArray(row?.clientBrand)
        ? row.clientBrand
        : Array.isArray(latest?.clientBrand)
        ? latest.clientBrand
        : [],
      beforeBalance: row?.beforeBalance ?? latest?.beforeBalance ?? null,
      afterBalance: row?.afterBalance ?? latest?.afterBalance ?? null,
      clientBalanceBeforeActivation:
        row?.clientBalanceBeforeActivation ??
        latest?.clientBalanceBeforeActivation ??
        row?.beforeBalance ??
        latest?.beforeBalance ??
        null,
      clientBalanceAfterActivation:
        row?.clientBalanceAfterActivation ??
        latest?.clientBalanceAfterActivation ??
        row?.afterBalance ??
        latest?.afterBalance ??
        row._remainingBalance ??
        null,
      remainingBalance: row._remainingBalance,
      message: getDisplayMessage(row),
      historyMessage:
        row?.historyMessage ??
        row?.history_message ??
        latest?.historyMessage ??
        latest?.history_message ??
        getDisplayMessage(row),
      redeemHistory: sameCodeHistory,
      raw: row,
    });
    setOpenPop(true);
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="ch-page">
      <div className="ch-stickyHeader">
        <div className="ch-navbar">
          <button
            className="ch-backIcon"
            onClick={() => onBack?.()}
            type="button"
            aria-label="Back"
          >
            <IoChevronBack size={26} />
          </button>
          <div className="ch-leftWrap">
            <div className="ch-brand">
              <img
                src={profileImg || DefaultProfile}
                alt="Profile"
                className="ch-logo"
              />
            </div>
            <div className="ch-balance">
              <div className="ch-balanceLabel">Current Balance</div>
              <div className="ch-balanceValue">
                ₹{formatAmount(liveBalance).toFixed(2)}
              </div>
              <div className="ch-clientName">{clientName || "Client"}</div>
            </div>
          </div>
        </div>

        <div className="ch-tabsWrap">
          <div className="ch-tabs">
            <button
              type="button"
              className={`ch-tab ${activeTab === "history" ? "active" : ""}`}
              onClick={() => setActiveTab("history")}
            >
              History
            </button>
            <div className="ch-tabDivider" />
            <button
              type="button"
              className={`ch-tab ${activeTab === "tc" ? "active" : ""}`}
              onClick={() => setActiveTab("tc")}
            >
              T&amp;C
            </button>
          </div>
          <div
            className="ch-activeLine"
            style={{
              transform: activeTab === "history" ? "translateX(0%)" : "translateX(100%)",
            }}
          />
        </div>
      </div>

      <div className="ch-scrollArea">
        {activeTab === "history" ? (
          <div className="ch-list">
            {loading && <div className="ch-empty">Loading history...</div>}
            {!loading && uniqueHistory.length === 0 && (
              <div className="ch-empty">{historyError || "No history available"}</div>
            )}
            {!loading &&
              uniqueHistory.map((row, idx) => {
                const eventType = row._eventType;
                const codeType = row._codeType;
                const dotClass = getDotClass(eventType, codeType, row._status);
                const code = row._code;
                const serialNumber = row._serialNumber;
                const message = getDisplayMessage(row);

                return (
                  <div
                    className="ch-row"
                    key={
                      codeType === "PHYSICAL"
                        ? `physical-${row._databaseId ?? row._serialNumber ?? row._referenceNumber ?? idx}`
                        : `digital-${code}-${idx}`
                    }
                  >
                    <div className="ch-date">{formatDate(row._eventDate)}</div>
                    <button
                      type="button"
                      className="ch-viewBtn"
                      onClick={() => openDetails(row)}
                    >
                      View Details
                    </button>
                    <div className="ch-info">
                      <div className="ch-message">{message}</div>
                      <div className="ch-subText">
                        Code: <strong>{code}</strong>
                      </div>
                      {codeType === "PHYSICAL" && serialNumber && (
                        <div className="ch-subText">
                          Serial Number: {serialNumber}
                        </div>
                      )}
                    </div>
                    <div className="ch-amountWrap">
                      <span className={`ch-dot ${dotClass}`} />
                      <span className="ch-amount">
                        ₹{formatAmount(row._amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="ch-tcCard">
            <h3>Terms &amp; Conditions</h3>
            <ul>
              <li>Once issued, a voucher cannot be cancelled.</li>
              <li>The voucher must be redeemed before expiry.</li>
              <li>Partial redemption depends on brand policy.</li>
              <li>Physical TruCard codes are linked with their serial number.</li>
              <li>Digital and Physical code transactions are maintained separately in history.</li>
              <li>Client-wise history contains both Digital and Physical TruCard records.</li>
              <li>TRUVISH reserves the right to update the terms at any time.</li>
            </ul>
          </div>
        )}
      </div>

      <DetailsPop
        open={openPop}
        onClose={() => setOpenPop(false)}
        details={selected}
        profileImg={profileImg || DefaultProfile}
      />
    </div>
  );
}
