import React, { useEffect, useRef, useState } from "react";
import "./ProfileScreen.css";
import { FaCamera } from "react-icons/fa";
import { IoChevronBack } from "react-icons/io5";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { MdOutlineMail } from "react-icons/md";
import logo from "../../assets/LOGO/TRV.png";
import defaultProfile from "../../assets/DefaultProfile/DP.png";

const BASE_URL = "http://localhost:8080";

export default function ProfileScreen({
  client,
  profileImg,
  onBack,
  onSaved,
}) {
  const fileRef = useRef(null);

  const [companyName, setCompanyName] = useState("");
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [profilePreview, setProfilePreview] = useState(defaultProfile);
  const [profileFile, setProfileFile] = useState(null);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setCompanyName(client?.companyName || "");
    setClientName(client?.clientName || "");
    setEmail(client?.email || "");
    setPhone(client?.mobileNumber || "");
    setProfilePreview(profileImg || defaultProfile);
  }, [client, profileImg]);

  const openFilePicker = () => fileRef.current?.click();

  const onPickFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!client?.id) {
      alert("Client ID not found");
      return;
    }

    try {
      setSaving(true);

      const fd = new FormData();

      const clientJson = {
        mobileNumber: phone,
        companyName,
        clientName,
        email,
      };

      fd.append(
        "client",
        new Blob([JSON.stringify(clientJson)], {
          type: "application/json",
        })
      );

      if (profileFile) {
        fd.append("logo", profileFile);
      }

      const res = await fetch(`${BASE_URL}/api/clients/${client.id}`, {
        method: "PUT",
        body: fd,
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Profile update failed:", errText);
        alert("Profile update failed");
        return;
      }

      const updated = await res.json();
      alert("Profile updated successfully");

      onSaved?.(updated);
      onBack?.();
    } catch (error) {
      console.error("Save error:", error);
      alert("Something went wrong while saving");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ps-page">
      {/* TOP LEFT BACK BUTTON */}
      <button
        type="button"
        className="ps-backBtnTop"
        onClick={onBack}
        aria-label="Go back"
      >
        <IoChevronBack size={24} />
      </button>

      <div className="ps-card">
        <div className="ps-brand">
          <img src={logo} alt="TRUVISH" className="ps-logo" />
        </div>

        <h1 className="ps-title">Client Profile</h1>
        <p className="ps-subtitle">
          View your details and update your profile photo.
        </p>

        <form className="ps-form" onSubmit={handleSave}>
          <div className="ps-field">
            <span className="ps-iconWrap" aria-hidden="true">
              <MdDriveFileRenameOutline size={20} />
            </span>
            <input
              className="ps-input"
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          <div className="ps-field">
            <span className="ps-iconWrap" aria-hidden="true">
              <MdDriveFileRenameOutline size={20} />
            </span>
            <input
              className="ps-input"
              placeholder="Client Name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>

          <div className="ps-field">
            <span className="ps-iconWrap" aria-hidden="true">
              <MdOutlineMail size={20} />
            </span>
            <input
              className="ps-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="ps-avatarWrap">
            <div
              className="ps-avatar"
              onClick={openFilePicker}
              role="button"
              tabIndex={0}
            >
              <img
                src={profilePreview}
                alt="Profile"
                className="ps-avatarImg"
                onError={(e) => {
                  e.currentTarget.src = defaultProfile;
                }}
              />
            </div>

            <div className="ps-avatarLabel">Profile Photo</div>
          </div>

          <button
            type="button"
            className="ps-uploadBox"
            onClick={openFilePicker}
          >
            <div className="ps-uploadIcon">
              <FaCamera />
            </div>
            <div className="ps-uploadText">
              <div className="ps-uploadTitle">Edit Photo</div>
              <div className="ps-uploadHint">Change your profile picture</div>
            </div>
          </button>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="ps-hiddenFile"
            onChange={onPickFile}
          />

          <div className="ps-phoneRow">
            <div className="ps-code">+91</div>
            <input
              className="ps-phone"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              placeholder="Enter mobile number"
              inputMode="numeric"
            />
          </div>

          <button className="ps-btn" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>

          <div className="ps-secure">
            <span className="ps-lock" aria-hidden="true">🔒</span>
            <span>Secure &amp; Encrypted</span>
          </div>
        </form>
      </div>
    </div>
  );
}