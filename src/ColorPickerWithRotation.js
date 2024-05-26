import React, { useState, useEffect } from "react";

const ColorPickerWithRotation = ({ currentColor, onChangeColor, currentRotation, onChangeRotation }) => {
  const [rotation, setRotation] = useState(currentRotation || 0);
  const [tempRotation, setTempRotation] = useState(0);

  useEffect(() => {
    setRotation(currentRotation);
  }, [currentRotation]);

  const handleColorChange = (e) => {
    onChangeColor(e.target.value);
  };

  const handleTempRotationChange = (e) => {
    setTempRotation(parseFloat(e.target.value));
  };

  const applyRotation = (direction) => {
  const parsedTempRotation = parseFloat(tempRotation);
  if (!isNaN(parsedTempRotation)) {
    const newRotation = direction === "left" ? rotation - parsedTempRotation : rotation + parsedTempRotation;
    setRotation(newRotation);
    onChangeRotation(newRotation);
  } else {
    console.error("Invalid rotation value");
  }
};


  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <input
        type="color"
        value={currentColor}
        onChange={handleColorChange}
      />
      <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center' }}>
        <span>Повернути на: </span>
        <input
          type="number"
          value={tempRotation}
          onChange={handleTempRotationChange}
          placeholder="Градуси"
          style={{ width: '60px', margin: '0 10px' }}
        />
        <button onClick={() => applyRotation("left")}>Вліво</button>
        <button onClick={() => applyRotation("right")}>Вправо</button>
      </div>
    </div>
  );
}; 

export default ColorPickerWithRotation;
