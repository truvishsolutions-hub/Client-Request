import React, { useState, useEffect } from "react";
import "./ClientHistory.css";
import DefaultProfile from "../../assets/DefaultProfile/DP.png";
import DetailsPop from "./DetailsPop";
import { IoChevronBack } from "react-icons/io5";

// ✅ RAILWAY BACKEND
const BASE_URL = "https://grateful-warmth-production-b64e.up.railway.app";

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
      .then(res => res.json())
      .then(data => setHistory(data || []))
      .catch(() => setHistory([]));
  }, [clientName]);

  const makeDetails = (row) => {
    const created = new Date(row.truvishCodeTimestamp);
    const validityDate = new Date(created);
    validityDate.setDate(validityDate.getDate() + row.validity);

    const today = new Date();

    let status = "Redeemed";

    if (row.truvishCodeStatus === "INACTIVE") {
      status = "UnRedeemed";
    }
    else if (today > validityDate) {
      status = "Expired";
    }

    return {
      code: row.truvishIdCodeNumber,
      value: row.truvishCodeValue,
      validity: validityDate.toLocaleDateString(),
      status
    };
  };

  return (
    <div className="ch-page">

      <div className="ch-stickyHeader">

        <div className="ch-navbar">

          {/* ✅ LEFT BACK */}
          <button className="ch-backIcon" onClick={() => onBack?.()}>
            <IoChevronBack size={26} />
          </button>

          {/* ✅ ORIGINAL STRUCTURE (UNCHANGED) */}
          <div className="ch-leftWrap">

            {/* CLIENT LOGO (NOW CENTERED VIA CSS) */}
            <div className="ch-brand">
              <img
                src={profileImg || DefaultProfile}
                alt="Profile"
                className="ch-logo"
              />
            </div>

            {/* CLIENT INFO (RIGHT SAME) */}
            <div className="ch-balance">
              <div className="ch-balanceLabel">
                Current Balance
              </div>

              <div className="ch-balanceValue">
                ₹{Number(clientBalance || 0).toFixed(2)}
              </div>

              <div className="ch-clientName">
                {clientName}
              </div>
            </div>

          </div>

        </div>

        {/* TABS SAME */}
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

      {/* CONTENT SAME */}
      <div className="ch-scrollArea">

        {activeTab === "history" ? (

          <div className="ch-list">

            {history.length === 0 && (
              <div style={{padding:"20px", textAlign:"center"}}>
                No history available
              </div>
            )}

            {history.map((row, idx) => {

              const created = new Date(row.truvishCodeTimestamp);

              return (

                <div className="ch-row" key={idx}>

                  <div className="ch-date">
                    {created.toLocaleDateString()}
                  </div>

                  <button
                    className="ch-viewBtn"
                    onClick={() => {
                      setSelected(makeDetails(row));
                      setOpenPop(true);
                    }}
                  >
                    View Details
                  </button>

                  <div className="ch-amountWrap">

                    <span className="ch-dot green" />

                    <span className="ch-amount">
                      ₹{row.truvishCodeValue}
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
              <li>Voucher once issued cannot be cancelled.</li>
              <li>Voucher must be redeemed before expiry.</li>
              <li>Partial redemption depends on brand policy.</li>
              <li>TRUVISH reserves the right to modify terms.</li>
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