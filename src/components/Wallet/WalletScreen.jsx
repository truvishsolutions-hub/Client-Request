// src/components/Wallet/WalletScreen.jsx

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  IoChevronBack,
} from "react-icons/io5";

import "./WalletScreen.css";

import moneyIcon from "../../assets/MONEY/RU.png";
import defaultProfile from "../../assets/DefaultProfile/DP.png";

/* =========================================================
   BACKEND
========================================================= */

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://truvish-backend-production.up.railway.app";

/* =========================================================
   DATE FORMAT
========================================================= */

function formatDateTime(dt) {
  if (!dt) return "";

  const d = new Date(dt);

  if (Number.isNaN(d.getTime())) {
    return String(dt);
  }

  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();

  let hours = d.getHours();

  const minutes = String(
    d.getMinutes()
  ).padStart(2, "0");

  const ampm =
    hours >= 12
      ? "PM"
      : "AM";

  hours = hours % 12;

  if (hours === 0) {
    hours = 12;
  }

  return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
}

/* =========================================================
   NUMBER
========================================================= */

function formatMoney(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0.00";
  }

  return number.toFixed(2);
}

/* =========================================================
   EXTRACT TRANSACTIONS
========================================================= */

function extractTransactions(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.content)) {
    return data.content;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.transactions)) {
    return data.transactions;
  }

  return [];
}

/* =========================================================
   WALLET TRANSACTION TITLE
========================================================= */

function getTransactionTitle(transaction, type) {
  /*
   * =======================================================
   * PHYSICAL TRUCARD
   *
   * IMPORTANT:
   *
   * Agar backend mein purana description ho:
   *
   * TruBlankCode - IKDA-5SDE-DSFE
   *
   * ya:
   *
   * TruBlankCode activation - IKDA-5SDE-DSFE
   *
   * wallet UI mein kabhi show nahi hoga.
   *
   * TRUCARD transaction hamesha:
   *
   * TruCard Debited
   *
   * show karega.
   * =======================================================
   */

  const referenceType = String(
    transaction?.referenceType ||
      transaction?.reference_type ||
      ""
  )
    .trim()
    .toUpperCase();

  const description = String(
    transaction?.description ||
      ""
  ).trim();

  const message = String(
    transaction?.message ||
      ""
  ).trim();

  /*
   * PRIMARY CHECK
   *
   * Backend:
   * referenceType = TRUCARD
   */
  if (
    referenceType === "TRUCARD" ||
    referenceType === "TRU_CARD" ||
    referenceType === "PHYSICAL" ||
    referenceType === "PHYSICAL_TRUCARD"
  ) {
    return "TruCard Debited";
  }

  /*
   * SECONDARY CHECK
   *
   * Agar old backend transaction mein
   * referenceType nahi hai lekin description
   * TruBlankCode se aa rahi hai.
   *
   * Is case mein bhi code UI mein nahi dikhega.
   */
  const oldBlankCodeText =
    `${description} ${message}`.toLowerCase();

  if (
    oldBlankCodeText.includes("trublankcode") ||
    oldBlankCodeText.includes("trucard activation") ||
    oldBlankCodeText.includes("trucard activated") ||
    oldBlankCodeText.includes("blank code activation") ||
    oldBlankCodeText.includes("blankcode activation")
  ) {
    return "TruCard Debited";
  }

  /*
   * DIGITAL VOUCHER
   */
  if (type === "debit") {
    return (
      description ||
      message ||
      "Debited"
    );
  }

  /*
   * CREDIT
   */
  return (
    description ||
    message ||
    "Truvish Gifts"
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function WalletScreen({
  onBack,
  clientId = null,
  clientName = "Client",
  profileImg = null,
}) {
  const [balance, setBalance] =
    useState(0);

  const [payments, setPayments] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [err, setErr] =
    useState("");

  const profileSrc =
    useMemo(
      () =>
        profileImg ||
        defaultProfile,
      [profileImg]
    );

  /* =======================================================
     LOAD WALLET
  ======================================================= */

  useEffect(() => {
    if (!clientId) {
      setErr(
        "clientId missing. Wallet cannot load."
      );

      setPayments([]);

      return;
    }

    let mounted = true;

    const loadWallet = async () => {
      setErr("");
      setLoading(true);

      try {
        /* =================================================
           CLIENT BALANCE
        ================================================= */

        const clientRes =
          await fetch(
            `${BASE_URL}/api/clients/${clientId}`
          );

        if (!clientRes.ok) {
          const txt =
            await clientRes.text();

          throw new Error(
            `Client API failed (${clientRes.status}): ${txt}`
          );
        }

        const clientData =
          await clientRes.json();

        if (
          mounted &&
          clientData?.balance != null
        ) {
          setBalance(
            clientData.balance
          );
        }

        /* =================================================
           ALL WALLET TRANSACTIONS
        ================================================= */

        const allTransactions = [];

        let page = 0;

        const size = 100;

        let hasMore = true;

        const MAX_PAGES = 100;

        while (
          hasMore &&
          page < MAX_PAGES
        ) {
          const txRes =
            await fetch(
              `${BASE_URL}/api/wallet/${clientId}/transactions?page=${page}&size=${size}`
            );

          if (!txRes.ok) {
            const txt =
              await txRes.text();

            throw new Error(
              `Wallet API failed (${txRes.status}): ${txt}`
            );
          }

          const data =
            await txRes.json();

          const list =
            extractTransactions(
              data
            );

          allTransactions.push(
            ...list
          );

          if (
            data?.last === true
          ) {
            hasMore = false;
          } else if (
            data?.hasNext === false
          ) {
            hasMore = false;
          } else if (
            list.length < size
          ) {
            hasMore = false;
          } else {
            page += 1;
          }
        }

        /* =================================================
           MAP TRANSACTIONS
        ================================================= */

        const mapped =
          allTransactions
            .map(
              (
                transaction,
                index
              ) => {
                const rawType =
                  String(
                    transaction?.type ||
                      transaction?.transactionType ||
                      transaction?.txnType ||
                      ""
                  )
                    .trim()
                    .toUpperCase();

                /* =========================================
                   TRANSACTION TYPE
                ========================================= */

                let type;

                if (
                  rawType === "DEBIT" ||
                  rawType === "DR" ||
                  rawType === "WITHDRAW"
                ) {
                  type = "debit";
                } else if (
                  rawType === "CREDIT" ||
                  rawType === "CR" ||
                  rawType === "DEPOSIT"
                ) {
                  type = "credit";
                } else {
                  const rawAmount =
                    Number(
                      transaction?.amount ??
                        transaction?.value ??
                        0
                    );

                  type =
                    rawAmount < 0
                      ? "debit"
                      : "credit";
                }

                /* =========================================
                   AMOUNT
                ========================================= */

                const amount =
                  Math.abs(
                    Number(
                      transaction?.amount ??
                        transaction?.value ??
                        0
                    )
                  );

                /* =========================================
                   DATE
                ========================================= */

                const transactionDate =
                  transaction?.txnDateTime ||
                  transaction?.transactionDateTime ||
                  transaction?.createdAt ||
                  transaction?.date ||
                  transaction?.timestamp ||
                  null;

                /* =========================================
                   TITLE
                =========================================

                   IMPORTANT:
                   Physical TruCard will ALWAYS show:

                   TruCard Debited

                   Never:
                   TruBlankCode - XXXX
                   TruBlankCode activation - XXXX
                ========================================= */

                const title =
                  getTransactionTitle(
                    transaction,
                    type
                  );

                return {
                  ...transaction,

                  _index: index,

                  title,

                  amount,

                  type,

                  date:
                    formatDateTime(
                      transactionDate
                    ),

                  transactionDate,
                };
              }
            );

        /* =================================================
           SORT NEWEST FIRST
        ================================================= */

        mapped.sort(
          (a, b) => {
            const aTime =
              new Date(
                a.transactionDate || 0
              ).getTime();

            const bTime =
              new Date(
                b.transactionDate || 0
              ).getTime();

            return bTime - aTime;
          }
        );

        if (mounted) {
          setPayments(mapped);
        }

        console.log(
          "========================================"
        );

        console.log(
          "✅ ALL WALLET TRANSACTIONS:",
          mapped
        );

        console.log(
          "💳 TOTAL TRANSACTIONS:",
          mapped.length
        );

        console.log(
          "💸 TOTAL DEBITS:",
          mapped.filter(
            (item) =>
              item.type === "debit"
          ).length
        );

        console.log(
          "========================================"
        );

      } catch (error) {
        console.error(
          "Wallet load error:",
          error
        );

        if (mounted) {
          setErr(
            error?.message ||
              "Something went wrong while loading wallet."
          );

          setPayments([]);
        }

      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadWallet();

    return () => {
      mounted = false;
    };

  }, [clientId]);

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="wl-page">

      {/* =================================================
          TOP BAR
      ================================================= */}

      <div className="wl-topbar">

        <button
          type="button"
          className="wl-back"
          onClick={onBack}
          aria-label="Back"
        >
          <IoChevronBack
            className="wl-backIcon"
            size={26}
          />
        </button>

        <button
          type="button"
          className="wl-profileBtn"
        >
          <img
            src={profileSrc}
            alt="Profile"
            className="wl-profileImg"
          />
        </button>

      </div>

      {/* =================================================
          CLIENT NAME
      ================================================= */}

      <div className="wl-greet">

        <div className="wl-dear">
          {clientName}
        </div>

      </div>

      {/* =================================================
          CURRENT BALANCE
      ================================================= */}

      <div className="wl-card wl-balanceCard">

        <div className="wl-balanceLeft">

          <div className="wl-balanceLabel">
            Current Balance
          </div>

          <div className="wl-balanceValue">
            ₹
            {formatMoney(
              balance
            )}
          </div>

        </div>

        <button
          type="button"
          className="wl-infoBtn"
        >
          i
        </button>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {err ? (
        <div
          className="wl-card"
          style={{
            padding: "12px",
            marginTop: "10px",
          }}
        >

          <div
            style={{
              fontWeight: 700,
            }}
          >
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

      {/* =================================================
          RECENT PAYMENTS
      ================================================= */}

      <div className="wl-card wl-paymentsCard">

        <div className="wl-cardTitle">

          Recent payments{" "}

          {loading
            ? "..."
            : `(${payments.length})`}

        </div>

        <div className="wl-list">

          {!loading &&
          payments.length === 0 ? (

            <div
              className="wl-sub"
              style={{
                padding:
                  "10px 2px",
              }}
            >
              No transactions yet.
            </div>

          ) : (

            payments.map(
              (
                payment,
                index
              ) => {

                const isCredit =
                  payment.type ===
                  "credit";

                return (
                  <div
                    className="wl-row"
                    key={
                      payment.id ??
                      `${payment.type}-${payment.transactionDate}-${index}`
                    }
                  >

                    {/* =================================
                        MONEY ICON
                    ================================= */}

                    <div className="wl-iconWrap">

                      <img
                        src={moneyIcon}
                        alt="Money"
                        className="wl-moneyIcon"
                      />

                    </div>

                    {/* =================================
                        TEXT
                    ================================= */}

                    <div className="wl-rowMid">

                      <div className="wl-title">
                        {payment.title}
                      </div>

                      <div className="wl-sub">
                        {payment.date}
                      </div>

                    </div>

                    {/* =================================
                        AMOUNT
                    ================================= */}

                    <div
                      className={`wl-amount ${
                        isCredit
                          ? "wl-credit"
                          : "wl-debit"
                      }`}
                    >
                      {isCredit
                        ? "+"
                        : "-"}{" "}
                      ₹
                      {formatMoney(
                        payment.amount
                      )}
                    </div>

                  </div>
                );
              }
            )

          )}

        </div>

      </div>

    </div>
  );
}