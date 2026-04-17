import React, { useState, useEffect } from "react";
import "./ClientHistory.css";
import DefaultProfile from "../../assets/DefaultProfile/DP.png";
import DetailsPop from "./DetailsPop";
import { IoChevronBack } from "react-icons/io5";

const BASE_URL = "http://localhost:8080";

export default function ClientHistory({
  onBack,
  clientName,
  clientBalance,
  profileImg
}) {
  const [activeTab, setActiveTab] = useState("history");
  const [history, setHistory] = useState([]);
  const [openPop, setOpenPop] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!clientName) return;

    fetch(`${BASE_URL}/api/truvish/history/${encodeURIComponent(clientName)}`)
      .then((res) => res.json())
      .then((data) => setHistory(Array.isArray(data) ? data : []))
      .catch(() => setHistory([]));
  }, [clientName]);

  const getDotClass = (eventType) => {
    const type = String(eventType || "").trim().toUpperCase();

    if (type === "CODE_ASSIGNED") return "green";
    if (type === "PARTIAL_REDEEM") return "orange";
    if (type === "FULL_REDEEM") return "red";

    return "green";
  };

  const getReadableStatus = (eventType) => {
    const type = String(eventType || "").trim().toUpperCase();

    if (type === "CODE_ASSIGNED") return "Issued";
    if (type === "PARTIAL_REDEEM") return "Partially Redeemed";
    if (type === "FULL_REDEEM") return "Redeemed";

    return "Issued";
  };

  const formatDate = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "-";

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);

    return `${day}/${month}/${year}`;
  };

  const openDetails = (row) => {
    setSelected({
      code: row?.code || "TR******",
      value: Number(row?.amount || 0),
      remainingBalance: Number(row?.remainingBalance || 0),
      validity: formatDate(row?.expiryDate),
      status: getReadableStatus(row?.eventType),
      eventType: row?.eventType || "",
      message: row?.message || "",
      eventTime: row?.eventTime || null
    });

    setOpenPop(true);
  };

  return (
    <div className="ch-page">
      <div className="ch-stickyHeader">
        <div className="ch-navbar">
          <button className="ch-backIcon" onClick={() => onBack?.()}>
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
                ₹{Number(clientBalance || 0).toFixed(2)}
              </div>

              <div className="ch-clientName">
                {clientName}
              </div>
            </div>
          </div>
        </div>

        <div className="ch-tabsWrap">
          <div className="ch-tabs">
            <button
              className={`ch-tab ${activeTab === "history" ? "active" : ""}`}
              onClick={() => setActiveTab("history")}
            >
              History
            </button>

            <div className="ch-tabDivider" />

            <button
              className={`ch-tab ${activeTab === "tc" ? "active" : ""}`}
              onClick={() => setActiveTab("tc")}
            >
              T&amp;C
            </button>
          </div>

          <div
            className="ch-activeLine"
            style={{
              transform:
                activeTab === "history"
                  ? "translateX(0%)"
                  : "translateX(100%)"
            }}
          />
        </div>
      </div>

      <div className="ch-scrollArea">
        {activeTab === "history" ? (
          <div className="ch-list">
            {history.length === 0 && (
              <div className="ch-empty">
                No history available
              </div>
            )}

            {history.map((row, idx) => {
              const dotClass = getDotClass(row?.eventType);

              return (
                <div className="ch-row" key={idx}>
                  <div className="ch-date">
                    {formatDate(row?.eventTime)}
                  </div>

                  <button
                    className="ch-viewBtn"
                    onClick={() => openDetails(row)}
                  >
                    View Details
                  </button>

                  <div className="ch-info">
                    <div className="ch-message">
                      {row?.message || "-"}
                    </div>

                    <div className="ch-subText">
                      Code: {row?.code || "-"}
                    </div>

                    <div className="ch-subText">
                      Remaining Balance: ₹{Number(row?.remainingBalance || 0).toFixed(2)}
                    </div>
                  </div>

                  <div className="ch-amountWrap">
                    <span className={`ch-dot ${dotClass}`} />
                    <span className="ch-amount">
                      ₹{Number(row?.amount || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="ch-tcCard">
            <h3>Terms & Conditions</h3>
            <ul>
              <li>Once issued, a voucher cannot be cancelled.</li>
              <li>The voucher must be redeemed before expiry.</li>
              <li>Partial redemption depends on brand policy.</li>
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