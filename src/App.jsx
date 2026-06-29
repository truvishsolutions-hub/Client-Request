import { useState } from "react";

import Login from "./components/Login/Login.jsx";
import OtpScreen from "./components/Login/OtpScreen.jsx";
import CreateAccount from "./components/Login/CreateAccount.jsx";

import TruvishClient from "./components/ClientHome/TruvishClient";
import ClientHistory from "./components/ClientHistory/ClientHistory.jsx";
import WalletScreen from "./components/Wallet/WalletScreen.jsx";
import ProfileScreen from "./components/ClientProfile/ProfileScreen.jsx";

import Validation from "./components/Validation/Validation.jsx";
import VoucherStep from "./components/Request/VoucherStep";
import SelectTheam from "./components/Theam/SelectTheam";
import ChooseBrands from "./components/ChooseBrands/ChooseBrands";
import ReviewConfirm from "./components/ReviewConfirm/ReviewConfirm";

import Congratulation from "./components/Congratulation/Congratulation.jsx";
import VoucherDetailsPopup from "./components/Congratulation/VoucherDetailsPopup";

import SelectQuantity from "./components/SelectQuantity/SelectQuantity";

// const BASE_URL = "http://localhost:8080";
const BASE_URL = "https://truvish-backend-production.up.railway.app";
const REDEEM_URL = "https://truvish.com";

const STEPS = {
  LOGIN: "login",
  OTP: "otp",
  CREATE: "create",
  HOME: "home",
  HISTORY: "history",
  WALLET: "wallet",
  PROFILE: "profile",
  VOUCHER: "voucher",
  VALIDATION: "validation",
  QUANTITY: "quantity",
  THEME: "theme",
  BRANDS: "brands",
  REVIEW: "review",
  CONGRATS: "congrats",
};

export default function App() {
  const [step, setStep] = useState(STEPS.LOGIN);
  const [authCountryCode, setAuthCountryCode] = useState("+91");
  const [authPhone, setAuthPhone] = useState("");
  const [authMobile10, setAuthMobile10] = useState("");
  const [client, setClient] = useState(null);
  const [validDays, setValidDays] = useState(60);
  const [voucherValue, setVoucherValue] = useState("50");
  const [occasion, setOccasion] = useState({ name: "", img: "" });
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [voucherCode, setVoucherCode] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [quantity, setQuantity] = useState(3);

  // 🔥 DYNAMIC CLIENT LOGO URL WITH CACHE BUSTER 🔥
  const clientLogoUrl =
    client?.id && client?.logoImg
      ? `${BASE_URL}/api/clients/${client.id}/logo?t=${Date.now()}`
      : "";

  return (
    <>
      {/* LOGIN */}
      {step === STEPS.LOGIN && (
        <Login
          countryCode={authCountryCode}
          onGetOtp={({ countryCode, mobile }) => {
            setAuthCountryCode(countryCode);
            setAuthMobile10(mobile);
            setAuthPhone(`${countryCode} ${mobile}`);
            setStep(STEPS.OTP);
          }}
        />
      )}

      {/* OTP */}
      {step === STEPS.OTP && (
        <OtpScreen
          phone={authPhone || "+91 **********"}
          rawMobile={authMobile10}
          onVerify={async (otpInput) => {
            try {
              const otp = String(otpInput || "").trim();
              if (!/^\d{4}$/.test(otp)) return { ok: false };

              const res = await fetch(
                `${BASE_URL}/api/clients/exists?mobile=${encodeURIComponent(authMobile10)}`
              );
              if (!res.ok) return { ok: false };

              const data = await res.json();
              if (data?.exists) {
                const cRes = await fetch(
                  `${BASE_URL}/api/clients/by-mobile?mobile=${encodeURIComponent(authMobile10)}`
                );
                if (cRes.ok) {
                  const cData = await cRes.json();
                  setClient(cData);
                }
                return { ok: true };
              }
              return { ok: false, reason: "NO_ACCOUNT" };
            } catch {
              return { ok: false };
            }
          }}
          onResend={() => {}}
          onBack={() => setStep(STEPS.LOGIN)}
          onSuccess={() => setStep(STEPS.HOME)}
          onCreateAccount={() => setStep(STEPS.CREATE)}
        />
      )}

      {/* CREATE ACCOUNT */}
      {step === STEPS.CREATE && (
        <CreateAccount
          defaultCountryCode={authCountryCode}
          defaultPhone={authMobile10 || "----------"}
          onSubmit={async ({ companyName, clientName, email, mobileNumber, logo }) => {
            try {
              const fd = new FormData();
              const clientJson = { mobileNumber, companyName, clientName, email };
              fd.append("client", new Blob([JSON.stringify(clientJson)], { type: "application/json" }));
              if (logo) fd.append("logo", logo);

              const res = await fetch(`${BASE_URL}/api/clients`, { method: "POST", body: fd });
              if (!res.ok) return;

              const saved = await res.json();
              setAuthMobile10(mobileNumber);
              setAuthPhone(`${authCountryCode} ${mobileNumber}`);
              setClient(saved);
              setStep(STEPS.HOME);
            } catch (error) {
              console.error("Create account failed:", error);
            }
          }}
        />
      )}

      {/* HOME */}
      {step === STEPS.HOME && (
        <TruvishClient
          onStart={() => setStep(STEPS.VOUCHER)}
          onOpenHistory={() => setStep(STEPS.HISTORY)}
          onOpenTc={() => {}}
          onOpenWallet={() => setStep(STEPS.WALLET)}
          onOpenProfile={() => setStep(STEPS.PROFILE)}
          clientId={client?.id}
          clientBalance={client?.balance}
          profileImg={clientLogoUrl}
        />
      )}

      {/* PROFILE */}
      {step === STEPS.PROFILE && (
        <ProfileScreen
          client={client}
          profileImg={clientLogoUrl}
          onBack={() => setStep(STEPS.HOME)}
          onSaved={(updatedClient) => {
            setClient(updatedClient);
            setStep(STEPS.HOME);
          }}
        />
      )}

      {/* WALLET */}
      {step === STEPS.WALLET && (
        <WalletScreen
          clientId={client?.id}
          clientName={client?.companyName || "Client"}
          profileImg={clientLogoUrl}
          onBack={() => setStep(STEPS.HOME)}
        />
      )}

      {/* HISTORY */}
      {step === STEPS.HISTORY && (
        <ClientHistory
          clientId={client?.id}
          clientName={client?.companyName}
          clientBalance={client?.balance}
          profileImg={clientLogoUrl}
          onBack={() => setStep(STEPS.HOME)}
        />
      )}

      {/* VOUCHER */}
      {step === STEPS.VOUCHER && (
        <VoucherStep
          onBack={() => setStep(STEPS.HOME)}
          onContinue={(value) => {
            setVoucherValue(value);
            setStep(STEPS.QUANTITY); // ✅ Validation ki jagah Quantity
          }}
        />
      )}

      {/* VALIDATION */}
      {step === STEPS.VALIDATION && (
        <Validation
          defaultDays={validDays}
          onBack={() => setStep(STEPS.QUANTITY)} // ✅ Back to Quantity
          onContinue={(days) => {
            setValidDays(days);
            setStep(STEPS.THEME);
          }}
        />
      )}

     {/* QUANTITY */}
     {step === STEPS.QUANTITY && (
       <SelectQuantity
         defaultQuantity={quantity}
         voucherValue={Number(voucherValue)}
         clientBalance={client?.balance || 0}
         onBack={() => setStep(STEPS.VOUCHER)} // ✅ Back to Voucher
         onContinue={(qty) => {
           setQuantity(qty);
           setStep(STEPS.VALIDATION); // ✅ Next to Validation
         }}
       />
     )}

      {/* THEME */}
      {step === STEPS.THEME && (
        <SelectTheam
          onBack={() => setStep(STEPS.VALIDATION)}
          onContinue={(themeData) => {
            setOccasion(themeData);
            setStep(STEPS.BRANDS);
          }}
        />
      )}

      {/* BRANDS */}
      {step === STEPS.BRANDS && (
        <ChooseBrands
          onBack={() => setStep(STEPS.THEME)}
          onContinue={(brands) => {
            setSelectedBrands(brands);
            setStep(STEPS.REVIEW);
          }}
        />
      )}

      {/* REVIEW - WITH MOCK IMPLEMENTATION */}
      {step === STEPS.REVIEW && (
        <ReviewConfirm
          voucherValue={voucherValue}
          quantity={quantity}
          occasion={occasion}
          validityMonths={validDays}
          selectedBrands={selectedBrands}
          onEditValue={() => setStep(STEPS.VOUCHER)}
          onEditOccasion={() => setStep(STEPS.THEME)}
          onEditValidity={() => setStep(STEPS.VALIDATION)}
          onEditBrands={() => setStep(STEPS.BRANDS)}
          onSubmit={async () => {
            try {
              console.log("🔄 Submitting voucher request...");
              console.log("📦 Payload:", {
                voucherValue,
                quantity,
                occasion,
                validDays,
                selectedBrands
              })

              /* =========================================
              🔥 OPTION 2: REAL API CALL (UNCOMMENT WHEN BACKEND READY)
              =========================================
               ========================================= */
              const brandLabels = selectedBrands.map((b) => b.label);
              const uniqueCategories = [
                ...new Set(
                  selectedBrands
                    .map((b) => b.category)
                    .filter((cat) => cat && cat.trim() !== "")
                ),
              ];

              const payload = {
                clientId: client?.id,
                clientName: client?.companyName || "",
                truvishCodeValue: Number(voucherValue),
                quantity: quantity,
                clientTheme: occasion?.name || "",
                clientThemeImg: occasion?.img || "",
                clientBrand: brandLabels,
                clientCategory: uniqueCategories,
                clientImg: client?.logoImg || "",
                validity: Number(validDays),
              };

              const res = await fetch(
                `${BASE_URL}/api/truvish/create-voucher`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(payload),
                }
              );

              if (!res.ok) {
                const errorText = await res.text();
                console.error("API Error:", errorText);
                alert("Failed to create voucher. Please try again.");
                return;
              }

              const saved = await res.json();

              console.log("API Response:", saved);

              // quantity jitne code aaye sab nikalo
              const dbCodes = Array.isArray(saved)
                ? saved.map(item => item.truvishIdCodeNumber)
                : [saved.truvishIdCodeNumber];

              console.log("Generated Codes:", dbCodes);

              if (!dbCodes.length) {
                console.error("No voucher code received");
                alert("No voucher code received");
                return;
              }

              setVoucherCode(dbCodes);
              setStep(STEPS.CONGRATS);

              // Refresh client data
              try {
                const updatedClientRes = await fetch(
                  `${BASE_URL}/api/clients/by-mobile?mobile=${encodeURIComponent(authMobile10)}`
                );
                if (updatedClientRes.ok) {
                  const updatedClientData = await updatedClientRes.json();
                  setClient(updatedClientData);
                }
              } catch (err) {
                console.error("Failed to refresh client:", err);
              }

              setVoucherCode(dbCodes);
              setStep(STEPS.CONGRATS);

            } catch (error) {
              console.error("❌ Submission error:", error);
              alert("An error occurred. Please try again.");
            }
          }}
        />
      )}

      {/* CONGRATULATIONS */}
      {step === STEPS.CONGRATS && (
        <Congratulation
            voucherCode={voucherCode || []}
          validityDays={validDays}
          client={client}
          onGoHome={() => {
            setStep(STEPS.HOME);
          }}
          onViewDetails={() => setShowDetails(true)}
          onRedeemNow={() => {
            window.open(REDEEM_URL, "_blank", "noopener,noreferrer");
          }}
          onCopy={(code) => {
            console.log("📋 Voucher copied:", code);
          }}
        />
      )}

      {/* POPUP */}
      <VoucherDetailsPopup
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        voucherCode={voucherCode}
        value={voucherValue}
        quantity={quantity}
        validity={`${validDays} ${
          validDays === 1 ? "Month" : "Months"
        }`}
        occasion={occasion?.name}
        brands={selectedBrands}
      />
    </>
  );
}