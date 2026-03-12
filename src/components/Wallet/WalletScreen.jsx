// src/components/Wallet/WalletScreen.jsx (FINAL PRODUCTION VERSION)

import React, { useEffect, useMemo, useState } from "react";
import "./WalletScreen.css";

import moneyIcon from "../../assets/MONEY/RU.png";
import defaultProfile from "../../assets/DefaultProfile/DP.png";

// ✅ Railway Backend
const BASE_URL = "https://grateful-warmth-production-b64e.up.railway.app";


// ✅ helper: backend datetime -> "12/2/2026 11:20 AM"
function formatDateTime(dt) {

  if (!dt) return "";

  const d = new Date(dt);

  if (Number.isNaN(d.getTime()))
    return String(dt);

  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();

  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  if (hours === 0) hours = 12;

  return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;

}


export default function WalletScreen({

  onBack,
  clientId = null,
  clientName = "Client",
  profileImg = null,

}) {

  const [balance, setBalance] = useState(1000);
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const profileSrc = useMemo(
    () => profileImg || defaultProfile,
    [profileImg]
  );


  useEffect(() => {

    if (!clientId) {

      setErr("clientId missing. Wallet cannot load.");
      return;

    }

    const loadWallet = async () => {

      setErr("");
      setLoading(true);

      try {

        // ===============================
        // CLIENT BALANCE
        // ===============================

        const clientRes = await fetch(`${BASE_URL}/api/clients/${clientId}`);

        if (!clientRes.ok) {

          const txt = await clientRes.text();
          throw new Error(`Client API failed (${clientRes.status}): ${txt}`);

        }

        const clientData = await clientRes.json();

        if (clientData?.balance != null)
          setBalance(clientData.balance);



        // ===============================
        // WALLET TRANSACTIONS
        // ===============================

        const txRes = await fetch(
          `${BASE_URL}/api/wallet/${clientId}/transactions?page=0&size=20`
        );

        if (!txRes.ok) {

          const txt = await txRes.text();
          throw new Error(`Wallet API failed (${txRes.status}): ${txt}`);

        }

        const data = await txRes.json();

        const list = Array.isArray(data?.content)
          ? data.content
          : Array.isArray(data)
          ? data
          : [];

        const mapped = list.map((t) => {

          const typeUpper = String(t.type || "").toUpperCase();

          const typeLower =
            typeUpper === "DEBIT"
              ? "debit"
              : "credit";

          const refType =
            String(t.referenceType || "").toUpperCase();


          // ===============================
          // TITLE RULE
          // ===============================

          let title = "";

          if (refType === "VOUCHER")
            title = "Truvish Gifts";

          else
            title =
              typeLower === "debit"
                ? "Debited"
                : "Credited";


          const amtNum = Number(t.amount ?? 0);

          return {

            title,
            amount: Math.abs(amtNum),

            type: typeLower,

            date: formatDateTime(
              t.txnDateTime || t.createdAt
            ),

          };

        });

        setPayments(mapped);

      } catch (e) {

        console.error("Wallet load error:", e);

        setErr(
          e?.message ||
            "Something went wrong while loading wallet."
        );

      } finally {

        setLoading(false);

      }

    };

    loadWallet();

  }, [clientId]);


  return (

    <div className="wl-page">

      {/* 🔝 TOP BAR */}

      <div className="wl-topbar">

        <button
          className="wl-back"
          onClick={onBack}
        >

          <span className="wl-backIcon">←</span>
          <span>Back</span>

        </button>


        <button className="wl-profileBtn">

          <img
            src={profileSrc}
            alt="Profile"
            className="wl-profileImg"
          />

        </button>

      </div>



      {/* CLIENT NAME */}

      <div className="wl-greet">

        <div className="wl-dear">
          {clientName}
        </div>

      </div>



      {/* CURRENT BALANCE */}

      <div className="wl-card wl-balanceCard">

        <div className="wl-balanceLeft">

          <div className="wl-balanceLabel">
            Current Balance
          </div>

          <div className="wl-balanceValue">
            ₹{balance}
          </div>

        </div>

        <button className="wl-infoBtn">
          i
        </button>

      </div>



      {/* ERROR MESSAGE */}

      {err ? (

        <div
          className="wl-card"
          style={{
            padding: "12px",
            marginTop: "10px",
          }}
        >

          <div style={{ fontWeight: 700 }}>
            Error
          </div>

          <div
            style={{
              marginTop: 6,
              fontSize: 13,
            }}
          >
            {err}
          </div>

        </div>

      ) : null}



      {/* RECENT PAYMENTS */}

      <div className="wl-card wl-paymentsCard">

        <div className="wl-cardTitle">

          Recent payments {loading ? "..." : ""}

        </div>


        <div className="wl-list">

          {!loading &&
          payments.length === 0 ? (

            <div
              className="wl-sub"
              style={{
                padding: "10px 2px",
              }}
            >
              No transactions yet.
            </div>

          ) : (

            payments.map((p, idx) => {

              const isCredit =
                p.type === "credit";

              return (

                <div
                  className="wl-row"
                  key={idx}
                >

                  <div className="wl-iconWrap">

                    <img
                      src={moneyIcon}
                      alt="Money"
                      className="wl-moneyIcon"
                    />

                  </div>


                  <div className="wl-rowMid">

                    <div className="wl-title">
                      {p.title}
                    </div>

                    <div className="wl-sub">
                      {p.date}
                    </div>

                  </div>


                  <div
                    className={`wl-amount ${
                      isCredit
                        ? "wl-credit"
                        : "wl-debit"
                    }`}
                  >
                    {isCredit ? "+" : "-"} ₹{p.amount}
                  </div>

                </div>

              );

            })

          )}

        </div>

      </div>

    </div>

  );

}