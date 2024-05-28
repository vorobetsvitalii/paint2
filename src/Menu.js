import React from "react";
import "./App.css";

const Menu = ({ setLineColor, setShape }) => {
  return (
    <div className="Menu">
      <label>Color</label>
      <input
        type="color"
        onChange={(e) => {
          setLineColor(e.target.value);
        }}
      />
      <label>Shape</label>
      <select onChange={(e) => setShape(e.target.value)}>
        <option value="pencil">Pencil</option>
        <option value="rectangle">Rectangle</option>
        <option value="circle">Circle</option>
        <option value="line">Line</option>
      </select>
    </div>
  );
};

export default Menu;
