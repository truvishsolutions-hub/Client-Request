// App.jsx (FINAL PRODUCTION VERSION - OTP ANY VALUE)

import { useState } from "react";

import Login from "./components/Login/Login.jsx";
import OtpScreen from "./components/Login/OtpScreen.jsx";
import CreateAccount from "./components/Login/CreateAccount.jsx";

import TruvishClient from "./components/ClientHome/TruvishClient";
import ClientHistory from "./components/ClientHistory/ClientHistory.jsx";
import WalletScreen from "./components/Wallet/WalletScreen.jsx";

import Validation from "./components/Validation/Validation.jsx";
import VoucherStep from "./components/Request/VoucherStep";
import SelectTheam from "./components/Theam/SelectTheam";
import ChooseBrands from "./components/ChooseBrands/ChooseBrands";
import ReviewConfirm from "./components/ReviewConfirm/ReviewConfirm";

import Congratulation from "./components/Congratulation/Congratulation.jsx";
import VoucherDetailsPopup from "./components/Congratulation/VoucherDetailsPopup";


// ✅ RAILWAY BACKEND
const BASE_URL =
"https://grateful-warmth-production-b64e.up.railway.app";


const STEPS = {
LOGIN:"login",
OTP:"otp",
CREATE:"create",
HOME:"home",
HISTORY:"history",
WALLET:"wallet",
VOUCHER:"voucher",
VALIDATION:"validation",
THEME:"theme",
BRANDS:"brands",
REVIEW:"review",
CONGRATS:"congrats"
};


export default function App(){

const [step,setStep] = useState(STEPS.LOGIN);

const [authCountryCode,setAuthCountryCode] = useState("+91");
const [authPhone,setAuthPhone] = useState("");
const [authMobile10,setAuthMobile10] = useState("");

const [client,setClient] = useState(null);

const [validDays,setValidDays] = useState(60);
const [voucherValue,setVoucherValue] = useState("50");

const [occasion,setOccasion] = useState({name:"",img:""});

const [recipients] = useState(1);

const [selectedBrands,setSelectedBrands] = useState([]);

const [voucherCode,setVoucherCode] = useState("");

const [showDetails,setShowDetails] = useState(false);



return(

<>

{/* ================= LOGIN ================= */}

{step===STEPS.LOGIN &&(

<Login

countryCode={authCountryCode}

onGetOtp={({countryCode,mobile})=>{

setAuthCountryCode(countryCode);

setAuthMobile10(mobile);

setAuthPhone(`${countryCode} ${mobile}`);

setStep(STEPS.OTP);

}}

 />

)}



{/* ================= OTP ================= */}

{step===STEPS.OTP &&(

<OtpScreen

phone={authPhone || "+91 **********"}

rawMobile={authMobile10}

onVerify={async(otpInput)=>{

try{

// ✅ ANY OTP ACCEPT
const otp = String(otpInput || "").trim();

if(otp.length!==4) return {ok:false};


// CLIENT EXIST CHECK

const res = await fetch(
`${BASE_URL}/api/clients/exists?mobile=${encodeURIComponent(authMobile10)}`
);

if(!res.ok) return {ok:false};

const data = await res.json();


if(data?.exists){

const cRes = await fetch(
`${BASE_URL}/api/clients/by-mobile?mobile=${encodeURIComponent(authMobile10)}`
);

if(cRes.ok){

const cData = await cRes.json();

setClient(cData);

}

return {ok:true};

}

return {ok:false,reason:"NO_ACCOUNT"};

}

catch{

return {ok:false};

}

}}

onResend={()=>{}}

onBack={()=>setStep(STEPS.LOGIN)}

onSuccess={()=>setStep(STEPS.HOME)}

onCreateAccount={()=>setStep(STEPS.CREATE)}

/>

)}



{/* ================= CREATE ACCOUNT ================= */}

{step===STEPS.CREATE &&(

<CreateAccount

defaultCountryCode={authCountryCode}

defaultPhone={authMobile10 || "----------"}

onSubmit={async({companyName,clientName,email,mobileNumber,logo})=>{

try{

const fd = new FormData();

const clientJson = {

mobileNumber,
companyName,
clientName,
email

};

fd.append(
"client",
new Blob([JSON.stringify(clientJson)],{type:"application/json"})
);

if(logo) fd.append("logo",logo);

const res = await fetch(`${BASE_URL}/api/clients`,{

method:"POST",
body:fd

});

if(!res.ok) return;

const saved = await res.json();

setAuthMobile10(mobileNumber);

setAuthPhone(`${authCountryCode} ${mobileNumber}`);

setClient(saved);

setStep(STEPS.HOME);

}

catch{}

}}

/>

)}



{/* ================= HOME ================= */}

{step===STEPS.HOME &&(

<TruvishClient

onStart={()=>setStep(STEPS.VOUCHER)}

onOpenHistory={()=>setStep(STEPS.HISTORY)}

onOpenTc={()=>{}}

onOpenWallet={()=>setStep(STEPS.WALLET)}

clientBalance={client?.balance}

profileImg={

client?.logoImg

? `${BASE_URL}/api/clients/${client?.id}/logo`

: null

}

/>

)}



{/* ================= WALLET ================= */}

{step===STEPS.WALLET &&(

<WalletScreen

clientId={client?.id}

clientName={client?.companyName || "Client"}

profileImg={

client?.logoImg

? `${BASE_URL}/api/clients/${client?.id}/logo`

: null

}

onBack={()=>setStep(STEPS.HOME)}

/>

)}



{/* ================= HISTORY ================= */}

{step===STEPS.HISTORY &&(

<ClientHistory

clientName={client?.companyName}

clientBalance={client?.balance}

profileImg={

client?.logoImg

? `${BASE_URL}/api/clients/${client?.id}/logo`

: null

}

onBack={()=>setStep(STEPS.HOME)}

/>

)}



{/* ================= VOUCHER VALUE ================= */}

{step===STEPS.VOUCHER &&(

<VoucherStep

onBack={()=>setStep(STEPS.HOME)}

onContinue={(value)=>{

setVoucherValue(value);

setStep(STEPS.VALIDATION);

}}

/>

)}



{/* ================= VALIDITY ================= */}

{step===STEPS.VALIDATION &&(

<Validation

defaultDays={validDays}

onBack={()=>setStep(STEPS.VOUCHER)}

onContinue={(days)=>{

setValidDays(days);

setStep(STEPS.THEME);

}}

/>

)}



{/* ================= THEME ================= */}

{step===STEPS.THEME &&(

<SelectTheam

onBack={()=>setStep(STEPS.VALIDATION)}

onContinue={(themeData)=>{

setOccasion(themeData);

setStep(STEPS.BRANDS);

}}

/>

)}



{/* ================= BRANDS ================= */}

{step===STEPS.BRANDS &&(

<ChooseBrands

onBack={()=>setStep(STEPS.THEME)}

onContinue={(brands)=>{

setSelectedBrands(brands);

setStep(STEPS.REVIEW);

}}

/>

)}



{/* ================= REVIEW ================= */}

{step===STEPS.REVIEW &&(

<ReviewConfirm

voucherValue={voucherValue}

occasion={occasion}

recipients={recipients}

selectedBrands={selectedBrands}

onEditValue={()=>setStep(STEPS.VOUCHER)}

onEditOccasion={()=>setStep(STEPS.THEME)}

onEditRecipients={()=>{}}

onEditBrands={()=>setStep(STEPS.BRANDS)}

onSubmit={async()=>{

try{

const brandLabels =
selectedBrands.map(b=>b.label);

const payload={

clientId:client?.id,

clientName:client?.companyName || "",

truvishCodeValue:Number(voucherValue),

clientTheme:occasion?.name || "",

clientThemeImg:occasion?.img || "",

clientBrand:brandLabels,

clientImg:client?.logoImg || "",

validity:Number(validDays)

};

const res = await fetch(
`${BASE_URL}/api/truvish/update-client`,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(payload)
}
);

if(!res.ok) return;

const saved = await res.json();

const dbCode = saved?.truvishIdCodeNumber;

if(!dbCode) return;

setVoucherCode(dbCode);

setStep(STEPS.CONGRATS);

}

catch{}

}}

/>

)}



{/* ================= CONGRATS ================= */}

{step===STEPS.CONGRATS &&(

<Congratulation

voucherCode={voucherCode}

onViewDetails={()=>setShowDetails(true)}

onGoSite={()=>setStep(STEPS.HOME)}

/>

)}



{/* ================= POPUP ================= */}

<VoucherDetailsPopup

isOpen={showDetails}

onClose={()=>setShowDetails(false)}

voucherCode={voucherCode}

value={voucherValue}

recipients={recipients}

occasion={occasion?.name}

brands={selectedBrands}

/>


</>

);

}
