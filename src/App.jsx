import { useState } from "react";
import TruvishClient from "./components/ClientHome/TruvishClient";
import VoucherStep from "./components/Request/VoucherStep";

function App() {
  const [step, setStep] = useState("home"); // default screen

  return (
    <>
      {step === "home" && <TruvishClient onStart={() => setStep("voucher")} />}
      {step === "voucher" && <VoucherStep />}
    </>
  );
}

export default App;
