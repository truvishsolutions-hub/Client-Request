import React, { useEffect, useRef, useState } from "react";
import "./CreateAccount.css";
import { FaCamera } from "react-icons/fa";
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
    <div className="ca-page">
      <div className="ca-card">
        <div className="ca-brand">
          <img src={logo} alt="TRUVISH" className="ca-logo" />
        </div>

        <h1 className="ca-title">My Profile</h1>
        <p className="ca-subtitle">
          View your details and update your profile photo.
        </p>

        <form className="ca-form" onSubmit={handleSave}>
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

          {/* Profile Preview */}
          <div className="ca-avatarWrap">
            <div
              className="ca-avatar"
              onClick={openFilePicker}
              role="button"
              tabIndex={0}
            >
              <img
                src={profilePreview}
                alt="Profile"
                className="ca-avatarImg"
                onError={(e) => {
                  e.currentTarget.src = defaultProfile;
                }}
              />
              <div className="ca-avatarCam">
                <FaCamera />
              </div>
            </div>

            <div className="ca-avatarLabel">Profile Photo</div>
          </div>

          {/* Edit Photo Button */}
          <button
            type="button"
            className="ca-uploadBox"
            onClick={openFilePicker}
          >
            <div className="ca-uploadIcon">
              <FaCamera />
            </div>
            <div className="ca-uploadText">
              <div className="ca-uploadTitle">Edit Photo</div>
              <div className="ca-uploadHint">Change your profile picture</div>
            </div>
          </button>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="ca-hiddenFile"
            onChange={onPickFile}
          />

          {/* Phone */}
          <div className="ca-phoneRow">
            <div className="ca-code">+91</div>
            <input
              className="ca-phone"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              placeholder="Enter mobile number"
              inputMode="numeric"
            />
          </div>

          {/* Save Button */}
          <button className="ca-btn" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>

          <div className="ca-secure">
            <span className="ca-lock" aria-hidden="true">🔒</span>
            <span>Secure &amp; Encrypted</span>
          </div>
        </form>
      </div>
    </div>
  );
}