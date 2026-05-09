import React, { useEffect, useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import "./ChooseBrands.css";
import BrandInfoPopup from "../ChooseBrands/BrandInfoPopup";
import bgImage from "../../assets/HOMEBG/BG.jpeg"; // ✅ BG IMAGE

const BASE_URL =
  import.meta.env.VITE_API_URL || "https://truvish-backend-production.up.railway.app";

const ChooseBrands = ({ onBack, onContinue }) => {
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedBrandInfo, setSelectedBrandInfo] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/client-choose-brand`)
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setBrands(list);

        const cats = ["All", ...new Set(list.map((b) => b.category).filter(Boolean))];
        setCategories(cats);
      })
      .catch(() => setBrands([]))
      .finally(() => setLoading(false));
  }, []);

  const getImageUrl = (imgPath) => {
    if (!imgPath) return "";
    if (imgPath.startsWith("http")) return imgPath;
    if (imgPath.startsWith("/")) return `${BASE_URL}${imgPath}`;
    return `${BASE_URL}/uploads/${imgPath}`;
  };

  const filteredBrands = brands.filter((b) => {
    const matchSearch = b.brandName?.toLowerCase().includes(search.toLowerCase());
    const matchTab = activeTab === "All" || b.category === activeTab;
    return matchSearch && matchTab;
  });

  const toggleBrand = (id) => {
    const brand = brands.find((b) => b.id === id);
    if (!brand) return;

    setSelectedBrands((prev) => {
      const isSelected = prev.some((item) => item.id === id);

      if (isSelected) return prev.filter((item) => item.id !== id);

      if (prev.length < 5) {
        return [
          ...prev,
          {
            id: brand.id,
            label: brand.brandName,
            img: getImageUrl(brand.brandImg),
            category: brand.category,
          },
        ];
      }

      return prev;
    });
  };

  const isBrandSelected = (id) =>
    selectedBrands.some((item) => item.id === id);

  return (
    /* ✅ BG WRAPPER */
    <div
      className="cb-bg"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="cb-container">

        <div className="cb-header">
          <button className="cb-back-btn" onClick={onBack}>
            <IoChevronBack size={26} />
          </button>
          <div style={{ width: 26 }} />
        </div>

        <div className="cb-search-box">
          <input
            type="text"
            placeholder="Search for brands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="cb-tabs">
          {categories.map((tab) => (
            <button
              key={tab}
              className={`cb-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="cb-empty">Loading brands...</div>
        ) : filteredBrands.length === 0 ? (
          <div className="cb-empty">No brands found</div>
        ) : (
          <div className="cb-grid">
            {filteredBrands.map((b) => (
              <div
                key={b.id}
                className={`cb-card ${isBrandSelected(b.id) ? "active" : ""}`}
                onClick={() => toggleBrand(b.id)}
              >
                <img
                  src={getImageUrl(b.brandImg)}
                  alt={b.brandName}
                  className="cb-img"
                />

                {isBrandSelected(b.id) && <div className="cb-tick">✔</div>}

                <div
                  className="cb-info-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBrandInfo(b);
                    setShowPopup(true);
                  }}
                >
                  𝓲
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="cb-bottom">
          <button
            className="cb-btn"
            disabled={selectedBrands.length === 0}
            onClick={() => onContinue(selectedBrands)}
          >
            Review Request ({selectedBrands.length} brands)
          </button>

          <p className="cb-limit-text">
            Select up to 5 brands for your voucher request
          </p>
        </div>

        <BrandInfoPopup
          isOpen={showPopup}
          onClose={() => setShowPopup(false)}
          brand={selectedBrandInfo}
        />

      </div>
    </div>
  );
};

export default ChooseBrands;