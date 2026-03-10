import React, { useRef, useState } from "react";
import "./CreateAccount.css";
import { FaCamera } from "react-icons/fa";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { MdOutlineMail } from "react-icons/md";
import logo from "../../assets/LOGO/TRV.png";
import defaultProfile from "../../assets/DefaultProfile/DP.png";

export default function CreateAccount({
  defaultPhone = "----------",
  defaultCountryCode = "+91",
  onSubmit,
}) {
  const fileRef = useRef(null);

  const [companyName, setCompanyName] = useState("");
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(defaultPhone);

  const [profilePreview, setProfilePreview] = useState(defaultProfile);
  const [profileFile, setProfileFile] = useState(null); // ✅ actual file

  const openFilePicker = () => fileRef.current?.click();

  const onPickFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit?.({
      companyName,
      clientName,
      email,
      mobileNumber: phone,   // ✅ backend expects mobileNumber
      logo: profileFile,     // ✅ send file
    });
  };

  return (
    <div className="ca-page">
      <div className="ca-card">
        <div className="ca-brand">
          <img src={logo} alt="TRUVISH" className="ca-logo" />
        </div>

        <h1 className="ca-title">Sign Up to Continue</h1>
        <p className="ca-subtitle">
          Complete your registration to create <b>your account</b>.
        </p>

        <form className="ca-form" onSubmit={handleSubmit}>
          {/* Company Name */}
          <div className="ca-field">
            <span className="ca-iconWrap" aria-hidden="true">
              <MdDriveFileRenameOutline size={20} />
            </span>
            <input
              className="ca-input"
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          {/* Client Name */}
          <div className="ca-field">
            <span className="ca-iconWrap" aria-hidden="true">
              <MdDriveFileRenameOutline size={20} />
            </span>
            <input
              className="ca-input"
              placeholder="Client Name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="ca-field">
            <span className="ca-iconWrap" aria-hidden="true">
              <MdOutlineMail size={20} />
            </span>
            <input
              className="ca-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Upload Button */}
          <button type="button" className="ca-uploadBox" onClick={openFilePicker}>
            <div className="ca-uploadIcon"><FaCamera /></div>
            <div className="ca-uploadText">
              <div className="ca-uploadTitle">Upload Photo</div>
              <div className="ca-uploadHint">Upload your profile picture</div>
            </div>
          </button>

          {/* Circle Preview */}
          <div className="ca-avatarWrap">
            <div className="ca-avatar" onClick={openFilePicker} role="button" tabIndex={0}>
              <img src={profilePreview} alt="Profile" className="ca-avatarImg" />
            </div>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="ca-hiddenFile"
            onChange={onPickFile}
          />

          {/* Phone */}
          <div className="ca-phoneRow">
            <div className="ca-code">{defaultCountryCode}</div>
            <input
              className="ca-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="Enter mobile number"
              inputMode="numeric"
            />
          </div>

          <button className="ca-btn" type="submit">Sign Up</button>

          <div className="ca-secure">
            <span className="ca-lock" aria-hidden="true">🔒</span>
            <span>Secure &amp; Encrypted</span>
          </div>
        </form>
      </div>
    </div>
  );
}
