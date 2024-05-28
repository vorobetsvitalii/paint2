import React from "react";
import ColorPickerWithRotation from "./ColorPickerWithRotation";
import Menu from "./Menu";

const Head = ({
    move,
    deleteElement,
    changeSize,
    handleSizeChange,
    showColorPicker,
    setLineColor,
    setShape,
    selectedFigure,
    handleChangeColor,
    handleChangeRotation
}) => {
    return (
        <div style={{ display: "flex", width: "100%", justifyContent: "space-around", alignItems: "center" }}>
            <Menu setLineColor={setLineColor} setShape={setShape} />
            {showColorPicker ? (
                <ColorPickerWithRotation
                    handleMove={move}
                    selectedFigure={selectedFigure}
                    deleteElement={deleteElement}
                    changeSize={changeSize}
                    handleSizeChange={handleSizeChange}
                    currentColor={selectedFigure.color}
                    currentRotation={selectedFigure.rotation}
                    onChangeColor={handleChangeColor}
                    onChangeRotation={handleChangeRotation}
                />
            ) : (
                <div style={{ width: "300px" }}></div>
            )}
        </div>
    );
};

export default Head;
