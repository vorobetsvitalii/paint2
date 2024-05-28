import React, { useEffect, useState } from "react";
import "./App.css";

const ColorPickerWithRotation = ({ deleteElement, onChangeColor, currentRotation, onChangeRotation, selectedFigure, handleSizeChange, handleMove }) => {
  const [rotation, setRotation] = useState(currentRotation || 0);
  const [tempRotation, setTempRotation] = useState(0);
  const [size, setSize] = useState(0);
  const [moveX, setMoveX] = useState(0);
  const [moveY, setMoveY] = useState(0);

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

  const handleMoveXChange = (e) => {
    setMoveX(parseFloat(e.target.value));
  };

  const handleMoveYChange = (e) => {
    setMoveY(parseFloat(e.target.value));
  };

  return (
    <div class="edit">
      <div class="color-picker">
        <label for="color">Color:</label>
        <input
          id="color"
          type="color"
          value="#000000"
          onChange={handleColorChange}
        />
      </div>

      {selectedFigure.type !== "circle" ?
        <div class="rotation-controls">
          <label for="rotation">Rotate:</label>
          <input
            id="rotation"
            type="number"
            onChange={handleTempRotationChange}
            placeholder="°"
          />
          <button onClick={() => applyRotation("left")}>Left</button>
          <button onClick={() => applyRotation("right")}>Right</button>
        </div> : <div style={{width: '100px'}}></div>
      }

      <div class="move-controls">
        <label for="moveX">Replace  X:</label>
        <input
          id="moveX"
          type="number"
          onChange={handleMoveXChange}
          placeholder="px"
        />

        <label for="moveY">Y:</label>
        <input
          id="moveY"
          type="number"
          onChange={handleMoveYChange}
          placeholder="px"
        />
        <button onClick={() => handleMove(moveX, moveY)}>Move</button>
      </div>

      <div style={{ display: "flex", width: "100%", justifyContent: "space-around", alignItems: "center" }}>
        {selectedFigure.type !== "pencil" ?
          <div class="size-controls">
            <label for="size">Size:</label>
            <input
              id="size"
              type="number"
              placeholder="%"
              onChange={setSize}
            />
            <button onClick={() => { handleSizeChange(parseFloat(size.target.value | 0)) }} >+</button>
            <button onClick={() => { handleSizeChange(parseFloat(size.target.value) * (-1)) }} >-</button>
          </div> : <div style={{width: '100px'}}></div>}

        <div class="delete-button">
          <button onClick={deleteElement}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ColorPickerWithRotation;
