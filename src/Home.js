import React, { useCallback, useEffect, useRef, useState } from "react";
import Menu from "./Menu";
import ColorPickerWithRotation from "./ColorPickerWithRotation";
import "./App.css";

function Home() {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const colorPickerRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lineWidth, setLineWidth] = useState(6);
    const [lineColor, setLineColor] = useState("black");
    const [shape, setShape] = useState("pencil");
    const [lines, setLines] = useState([]);
    const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
    const [selectedFigure, setSelectedFigure] = useState(null);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [colorPickerPosition, setColorPickerPosition] = useState({ x: 0, y: 0 });
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user_id'));
    const [linesSize, setLinesSize] = useState(lines.length)


    useEffect(() => {
        
        async function fetchData() {
            let id = localStorage.getItem("user_id");
            try {
                const response = await fetch(`http://localhost:8080/api/shapes/painter/${id}/shapes`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                console.log(data);

                // Перетворюємо points з рядка в масив об'єктів
                const transformedData = data.map(item => ({
                    ...item,
                    points: JSON.parse(item.points)
                }));

                // Обробляємо отримані дані, наприклад, встановлюємо їх у стан компонента
                setLines(transformedData);
                setLinesSize(transformedData.length);
                console.log(linesSize);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
        setLinesSize(lines.length)
        console.log(linesSize);
    }, []);

    const redrawLines = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        lines.forEach((line) => {
            ctx.strokeStyle = line.color;
            ctx.lineWidth = line.lineWidth || lineWidth;
            ctx.save();
            if (line.rotation && line.type !== "circle") {
                const centerX = (line.points[0].x + line.points[1].x) / 2;
                const centerY = (line.points[0].y + line.points[1].y) / 2;
                ctx.translate(centerX, centerY);
                ctx.rotate((line.rotation * Math.PI) / 180);
                ctx.translate(-centerX, -centerY);
            }
            ctx.beginPath();
            if (line.type === "pencil") {
                ctx.moveTo(line.points[0].x, line.points[0].y);
                line.points.forEach((point) => {
                    ctx.lineTo(point.x, point.y);
                });
            } else if (line.type === "line") {
                ctx.moveTo(line.points[0].x, line.points[0].y);
                ctx.lineTo(line.points[1].x, line.points[1].y);
            } else if (line.type === "rectangle") {
                const startX = line.points[0].x;
                const startY = line.points[0].y;
                const endX = line.points[1].x;
                const endY = line.points[1].y;
                ctx.strokeRect(startX, startY, endX - startX, endY - startY);
            } else if (line.type === "circle") {
                const startX = line.points[0].x;
                const startY = line.points[0].y;
                const radius = line.radius;
                ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
            }
            ctx.stroke();
            ctx.restore();
        });
    }, [lines, lineWidth]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctxRef.current = ctx;
        redrawLines();
    }, [redrawLines]);

    const startDrawingPencil = (e) => {
        if (e.button !== 0) return;
        setIsDrawing(true);
        const startX = e.nativeEvent.offsetX;
        const startY = e.nativeEvent.offsetY;
        setLines((prevLines) => [
            ...prevLines,
            { type: "pencil", points: [{ x: startX, y: startY }], color: lineColor, rotation: 0 },
        ]);
    };

    const startDrawingLine = (e) => {
        if (e.button !== 0) return;
        setIsDrawing(true);
        const startX = e.nativeEvent.offsetX;
        const startY = e.nativeEvent.offsetY;
        setLines((prevLines) => [
            ...prevLines,
            { type: "line", points: [{ x: startX, y: startY }, { x: startX, y: startY }], color: lineColor, rotation: 0 },
        ]);
    };

    const startDrawingRectangle = (e) => {
        if (e.button !== 0) return;
        setIsDrawing(true);
        const startX = e.nativeEvent.offsetX;
        const startY = e.nativeEvent.offsetY;
        setLines((prevLines) => [
            ...prevLines,
            { type: "rectangle", points: [{ x: startX, y: startY }, { x: startX, y: startY }], color: lineColor, rotation: 0 },
        ]);
    };

    const startDrawingCircle = (e) => {
        if (e.button !== 0) return;
        setIsDrawing(true);
        const startX = e.nativeEvent.offsetX;
        const startY = e.nativeEvent.offsetY;
        setStartCoords({ x: startX, y: startY });
        setLines((prevLines) => [
            ...prevLines,
            { type: "circle", points: [{ x: startX, y: startY }], color: lineColor, radius: 0, rotation: 0 },
        ]);
    };

    const drawPencil = (e) => {
        if (!isDrawing) return;
        const newX = e.nativeEvent.offsetX;
        const newY = e.nativeEvent.offsetY;
        setLines((prevLines) => {
            const updatedLines = [...prevLines];
            const currentLine = updatedLines[updatedLines.length - 1];
            currentLine.points = [...currentLine.points, { x: newX, y: newY }];
            return updatedLines;
        });
    };

    const drawLine = (e) => {
        if (!isDrawing) return;
        const newX = e.nativeEvent.offsetX;
        const newY = e.nativeEvent.offsetY;
        setLines((prevLines) => {
            const updatedLines = [...prevLines];
            const currentLine = updatedLines[updatedLines.length - 1];
            currentLine.points[1] = { x: newX, y: newY };
            return updatedLines;
        });
    };

    const drawRectangle = (e) => {
        if (!isDrawing) return;
        const newX = e.nativeEvent.offsetX;
        const newY = e.nativeEvent.offsetY;
        setLines((prevLines) => {
            const updatedLines = [...prevLines];
            const currentLine = updatedLines[updatedLines.length - 1];
            currentLine.points[1] = { x: newX, y: newY };
            return updatedLines;
        });
    };

    const drawCircle = (e) => {
        if (!isDrawing) return;
        const startX = startCoords.x;
        const startY = startCoords.y;
        const endX = e.nativeEvent.offsetX;
        const endY = e.nativeEvent.offsetY;
        const radius = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
        setLines((prevLines) => {
            const updatedLines = [...prevLines];
            const currentLine = updatedLines[updatedLines.length - 1];
            currentLine.radius = radius;
            return updatedLines;
        });
    };

    const endDrawing = async () => {
        setIsDrawing(false);
        if (lines.length > linesSize) {
            console.log(lines.length, linesSize)
            console.log("endDrawing")
            
            let id = localStorage.getItem("user_id")
            let resp = await fetch(`http://localhost:8080/api/shapes/painter/${id}/shapes`, {
                method: "POST",
                body: JSON.stringify({
                    shape: lines[lines.length - 1]
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            });
            if (resp.status === 200) {
                console.log('added');
                setLinesSize(lines.length)
            }
        }
    };

    const drawShape = (e) => {
        if (shape === "pencil") drawPencil(e);
        else if (shape === "line") drawLine(e);
        else if (shape === "rectangle") drawRectangle(e);
        else if (shape === "circle") drawCircle(e);
    };

    const distToSegment = (x, y, x1, y1, x2, y2) => {
        const A = x - x1;
        const B = y - y1;
        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const len_sq = C * C + D * D;
        let param = -1;
        if (len_sq !== 0) param = dot / len_sq;

        let xx, yy;

        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        const dx = x - xx;
        const dy = y - yy;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const rotatePoint = (point, center, angle) => {
        const radians = (Math.PI / 180) * angle;
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        const translatedX = point.x - center.x;
        const translatedY = point.y - center.y;

        return {
            x: translatedX * cos - translatedY * sin + center.x,
            y: translatedX * sin + translatedY * cos + center.y,
        };
    };

    const handleRightClick = (e) => {
        e.preventDefault();
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        let foundFigure = null;
        let centerX = 0;
        let centerY = 0;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const rotation = line.rotation || 0;

            if (line.type === "rectangle") {
                const startX = line.points[0].x;
                const startY = line.points[0].y;
                const endX = line.points[1].x;
                const endY = line.points[1].y;

                const center = {
                    x: (startX + endX) / 2,
                    y: (startY + endY) / 2,
                };

                const rotatedStart = rotatePoint({ x: startX, y: startY }, center, rotation);
                const rotatedEnd = rotatePoint({ x: endX, y: endY }, center, rotation);

                const distToTopSide = distToSegment(mouseX, mouseY, rotatedStart.x, rotatedStart.y, rotatedEnd.x, rotatedStart.y);
                const distToRightSide = distToSegment(mouseX, mouseY, rotatedEnd.x, rotatedStart.y, rotatedEnd.x, rotatedEnd.y);
                const distToBottomSide = distToSegment(mouseX, mouseY, rotatedEnd.x, rotatedEnd.y, rotatedStart.x, rotatedEnd.y);
                const distToLeftSide = distToSegment(mouseX, mouseY, rotatedStart.x, rotatedEnd.y, rotatedStart.x, rotatedStart.y);

                if (distToTopSide <= 5 || distToRightSide <= 5 || distToBottomSide <= 5 || distToLeftSide <= 5) {
                    foundFigure = line;
                    centerX = center.x;
                    centerY = center.y;
                    break;
                }
            } else if (line.type === "circle") {
                const startX = line.points[0].x;
                const startY = line.points[0].y;
                const radius = line.radius;

                const distanceToCenter = Math.sqrt((mouseX - startX) ** 2 + (mouseY - startY) ** 2);

                if (Math.abs(distanceToCenter - radius) <= 5) {
                    foundFigure = line;
                    centerX = startX;
                    centerY = startY;
                    break;
                }

            } else if (line.type === "line") {
                const points = line.points;
                const centerX = (points[0].x + points[1].x) / 2;
                const centerY = (points[0].y + points[1].y) / 2;

                // Функція для обертання точки навколо центру
                const rotatePoint = (point, center, angle) => {
                    const rad = (Math.PI / 180) * angle;
                    const cos = Math.cos(rad);
                    const sin = Math.sin(rad);
                    const nx = cos * (point.x - center.x) - sin * (point.y - center.y) + center.x;
                    const ny = sin * (point.x - center.x) + cos * (point.y - center.y) + center.y;
                    return { x: nx, y: ny };
                };

                // Обертаємо обидві точки навколо центру
                const rotatedStartPoint = rotatePoint(points[0], { x: centerX, y: centerY }, line.rotation);
                const rotatedEndPoint = rotatePoint(points[1], { x: centerX, y: centerY }, line.rotation);

                const x1 = rotatedStartPoint.x;
                const y1 = rotatedStartPoint.y;
                const x2 = rotatedEndPoint.x;
                const y2 = rotatedEndPoint.y;

                const dist = distToSegment(mouseX, mouseY, x1, y1, x2, y2);

                if (dist <= 5) {
                    foundFigure = line;
                    break;
                }
            } else if (line.type === "pencil") {
                const points = line.points;
                // Центр обертання - перша точка лінії
                const center = points[0];

                // Обернути всі точки навколо центра
                const rotatedPoints = points.map(point => rotatePoint(point, center, rotation));

                for (let j = 0; j < rotatedPoints.length - 1; j++) {
                    const x1 = rotatedPoints[j].x;
                    const y1 = rotatedPoints[j].y;
                    const x2 = rotatedPoints[j + 1].x;
                    const y2 = rotatedPoints[j + 1].y;

                    const dist = distToSegment(mouseX, mouseY, x1, y1, x2, y2);

                    if (dist <= 5) {
                        foundFigure = line;
                        centerX = (x1 + x2) / 2;
                        centerY = (y1 + y2) / 2;
                        break;
                    }
                }
            }

        }

        if (foundFigure) {
            setSelectedFigure(foundFigure);
            setColorPickerPosition({ x: centerX, y: centerY });
            setShowColorPicker(true);
        } else {
            setShowColorPicker(false);
            setSelectedFigure(null);
        }
    };

    const handleClickOutside = (e) => {
        if (colorPickerRef.current && !colorPickerRef.current.contains(e.target)) {
            setShowColorPicker(false);
            setSelectedFigure(null);
        }
    };

    useEffect(() => {
        if (showColorPicker) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showColorPicker]);

    const handleChangeColor = (newColor) => {
        if (selectedFigure) {
            selectedFigure.color = newColor;
            setLines((prevLines) => [...prevLines]);

            // Відправляємо запит на сервер для оновлення фігури в базі даних
            fetch(`http://localhost:8080/api/shapes/shapes/${selectedFigure.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedFigure),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to update shape color');
                    }
                    // Якщо запит вдало виконаний, оновлюємо лінії на екрані та в localStorage
                    redrawLines();
                    localStorage.setItem("lines", JSON.stringify(lines));
                })
                .catch(error => {
                    console.error('Error updating shape color:', error);
                });
        }
    };

    const handleChangeRotation = (newRotation) => {
        if (selectedFigure) {
            selectedFigure.rotation = newRotation;
            setLines((prevLines) => [...prevLines]);

            // Відправляємо запит на сервер для оновлення фігури в базі даних
            fetch(`http://localhost:8080/api/shapes/shapes/${selectedFigure.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedFigure),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to update shape rotation');
                    }
                    // Якщо запит вдало виконаний, оновлюємо лінії на екрані та в localStorage
                    redrawLines();
                    localStorage.setItem("lines", JSON.stringify(lines));
                })
                .catch(error => {
                    console.error('Error updating shape rotation:', error);
                });
        }
    };
    
    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.addEventListener("contextmenu", handleRightClick);
        return () => {
            canvas.removeEventListener("contextmenu", handleRightClick);
        };
    }, [handleRightClick]);

    return (
        <div className="App">
            <h1>Paint App</h1>
            <div className="draw-area">
                <Menu setLineColor={setLineColor} setShape={setShape} />
                <canvas
                    onMouseDown={(e) => {
                        if (shape === "pencil") startDrawingPencil(e);
                        else if (shape === "line") startDrawingLine(e);
                        else if (shape === "rectangle") startDrawingRectangle(e);
                        else if (shape === "circle") startDrawingCircle(e);
                    }}
                    onMouseUp={endDrawing}
                    onMouseMove={drawShape}
                    ref={canvasRef}
                    width={`1280px`}
                    height={`720px`}
                />
                {showColorPicker && (
                    <div
                        ref={colorPickerRef}
                        style={{
                            position: "absolute",
                            left: `${colorPickerPosition.x}px`,
                            top: `${colorPickerPosition.y}px`,
                            transform: "translate(-50%, -50%)",
                        }}
                    >
                        <ColorPickerWithRotation
                            currentColor={selectedFigure.color}
                            currentRotation={selectedFigure.rotation}
                            onChangeColor={handleChangeColor}
                            onChangeRotation={handleChangeRotation}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;