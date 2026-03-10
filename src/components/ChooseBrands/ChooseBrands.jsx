import React, { useState } from "react";
import { IoChevronBack } from "react-icons/io5";

import "./ChooseBrands.css";

import amazon from "../../assets/BRAND/Am.png";
import flipkart from "../../assets/BRAND/Fl.png";
import swiggy from "../../assets/BRAND/Sw.png";
import zomato from "../../assets/BRAND/Zo.png";
import myntra from "../../assets/BRAND/My.png";
import uber from "../../assets/BRAND/Ub.png";

const ChooseBrands = ({ onBack, onContinue }) => {

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const brands = [
    { id:"amazon", label:"Amazon", category:"Shopping", img:amazon },
    { id:"flipkart", label:"Flipkart", category:"Shopping", img:flipkart },
    { id:"swiggy", label:"Swiggy", category:"Food", img:swiggy },
    { id:"zomato", label:"Zomato", category:"Food", img:zomato },
    { id:"myntra", label:"Myntra", category:"Shopping", img:myntra },
    { id:"uber", label:"Uber", category:"Travel", img:uber },
  ];

  const filteredBrands = brands.filter((b)=>{
    const matchSearch = b.label.toLowerCase().includes(search.toLowerCase());
    const matchTab = activeTab === "All" || b.category === activeTab;
    return matchSearch && matchTab;
  });

  const toggleBrand = (id)=>{

    setSelectedBrands(prev =>
      prev.includes(id)
        ? prev.filter(b=>b!==id)
        : prev.length < 5
        ? [...prev,id]
        : prev
    );

  };

  return (
    <div className="cb-container">

      {/* HEADER */}

      <div className="cb-header">

        <button className="cb-back-btn" onClick={onBack}>
          <IoChevronBack size={26}/>
        </button>

        <h2 className="cb-title">Choose Brands</h2>

        <div style={{width:26}}/>

      </div>


      {/* SEARCH */}

      <div className="cb-search-box">

        <input
          type="text"
          placeholder="Search for brands..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />

      </div>


      {/* TABS */}

      <div className="cb-tabs">

        {["All","Shopping","Food","Travel"].map(tab => (

          <button
            key={tab}
            className={`cb-tab ${activeTab===tab ? "active":""}`}
            onClick={()=>setActiveTab(tab)}
          >
            {tab}
          </button>

        ))}

      </div>


      {/* BRAND GRID */}

      <div className="cb-grid">

        {filteredBrands.map((b)=>(

          <div
            key={b.id}
            className={`cb-card ${selectedBrands.includes(b.id) ? "active":""}`}
            onClick={()=>toggleBrand(b.id)}
          >

            <img src={b.img} alt={b.label} className="cb-img"/>

            {selectedBrands.includes(b.id) &&
              <div className="cb-tick">✔</div>
            }

          </div>

        ))}

      </div>


      {/* BOTTOM */}

      <div className="cb-bottom">

        <button
          className="cb-btn"
          onClick={() =>
            onContinue(
              selectedBrands.map(id => {

                const brand = brands.find(b => b.id === id);

                return {
                  id: brand.id,
                  label: brand.label,
                  img: brand.img
                };

              })
            )
          }
        >

          Review Request ({selectedBrands.length} brands)

        </button>


        <p className="cb-limit-text">
          Select up to 5 brands for your voucher request
        </p>

      </div>

    </div>
  );
};

export default ChooseBrands;