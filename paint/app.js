//Elements UI
const canvas = document.getElementById("main-canvas");
const color = document.querySelector(".paint-block__input-color");
const thickness = document.querySelector(".paint-block__select-thickness");
const instruments = document.querySelector(".paint-block__select-instruments");
const fill = document.getElementsByName("fill");
const clear = document.querySelector(".btn-clear");
const save = document.querySelector(".btn-save");

//Adaptive size canvas
let width = 840,
  height = 500;

window.onload = function (event) {
  if (window.innerWidth > 1199) {
    canvas.width = width;
    canvas.height = height;
  }
  if (window.innerWidth <= 1199 && window.innerWidth > 991) {
    canvas.width = width * 0.8;
    canvas.height = height * 0.8;
  }
  if (window.innerWidth <= 991 && window.innerWidth > 767) {
    canvas.width = width * 0.6;
    canvas.height = height * 0.6;
  }
  if (window.innerWidth <= 767 && window.innerWidth > 575) {
    canvas.width = width * 0.4;
    canvas.height = height * 0.4;
  }
  if (window.innerWidth <= 575) {
    canvas.width = width * 0.5;
    canvas.height = height * 0.5;
  }
};

window.onresize = function (event) {
  if (window.innerWidth > 1199) {
    canvas.width = width;
    canvas.height = height;
  }
  if (window.innerWidth <= 1199 && window.innerWidth > 991) {
    canvas.width = width * 0.8;
    canvas.height = height * 0.8;
  }
  if (window.innerWidth <= 991 && window.innerWidth > 767) {
    canvas.width = width * 0.6;
    canvas.height = height * 0.6;
  }
  if (window.innerWidth <= 767 && window.innerWidth > 575) {
    canvas.width = width * 0.4;
    canvas.height = height * 0.4;
  }
  if (window.innerWidth <= 575) {
    canvas.width = width * 0.5;
    canvas.height = height * 0.5;
  }
};

//Flags
let isMouseDown = false;

//Help
let ctx = canvas.getContext("2d");
let myColor = "black";
let myThickness = 1;
let myInstrument = "Pencil";
let myFill = "solid";
let startX = 0;
let startY = 0;
let mouseX = 0;
let mouseY = 0;
let existingLines = [];
let existingPencilPoints = [];
let existingCircles = [];
let existingRectangles = [];
let existingTriangles = [];
let existingStars = [];
let existingClouds = [];
let existingErasePoints = [];

//Events
canvas.addEventListener("mousemove", onMouseMoveHandler);
canvas.addEventListener("mouseup", onMouseUpHandler);
canvas.addEventListener("mousedown", onMouseDownHandler);
color.addEventListener("input", onInputColorHandler);
thickness.addEventListener("change", onChangeThicknessHandler);
instruments.addEventListener("change", onChangeInstrumentsHandler);
clear.addEventListener("click", onClickClearHandler);
save.addEventListener("click", onClickSaveHandler);

function onMouseDownHandler(e) {
  checkFill();
  switch (myInstrument) {
    case "Pencil":
      isMouseDown = true;
      ctx.beginPath();
      ctx.strokeStyle = myColor;
      ctx.lineWidth = myThickness;
      break;
    case "Eraser":
      if (!isMouseDown) {
        startX = e.offsetX;
        startY = e.offsetY;
        isMouseDown = true;
      }
      doErase();
      break;
    case "Straight line":
      if (!isMouseDown) {
        startX = e.offsetX;
        startY = e.offsetY;
        isMouseDown = true;
      }
      drawLine();
      break;
    case "Circle":
      if (!isMouseDown) {
        startX = e.offsetX;
        startY = e.offsetY;
        isMouseDown = true;
      }
      drawCircle();
      break;
    case "Rectangle":
      if (!isMouseDown) {
        startX = e.offsetX;
        startY = e.offsetY;
        isMouseDown = true;
      }
      drawRectangle();
      break;
    case "Right triangle":
      if (!isMouseDown) {
        startX = e.offsetX;
        startY = e.offsetY;
        isMouseDown = true;
      }
      drawRightTriangle();
      break;
    case "Star":
      if (!isMouseDown) {
        startX = e.offsetX;
        startY = e.offsetY;
        isMouseDown = true;
      }
      drawStar();
      break;
    case "Cloud":
      if (!isMouseDown) {
        startX = e.offsetX;
        startY = e.offsetY;
        isMouseDown = true;
      }
      drawCloud();
      break;
  }
}

function onMouseUpHandler(e) {
  switch (myInstrument) {
    case "Pencil":
      existingPencilPoints.push(false);
      isMouseDown = false;
      break;
    case "Eraser":
      if (isMouseDown) {
        existingErasePoints.push({
          startX: startX,
          startY: startY,
          endX: mouseX,
          endY: mouseY,
          thickness: myThickness,
        });
        isMouseDown = false;
      }
      doErase();
      break;
    case "Straight line":
      if (isMouseDown) {
        existingLines.push({
          startX: startX,
          startY: startY,
          endX: mouseX,
          endY: mouseY,
          color: myColor,
          thickness: myThickness,
        });
        isMouseDown = false;
      }
      drawLine();
      break;
    case "Circle":
      if (isMouseDown) {
        existingCircles.push({
          startX: startX,
          startY: startY,
          endX: mouseX,
          endY: mouseY,
          radius: Math.abs(mouseY - startY),
          color: myColor,
          thickness: myThickness,
          filling: myFill,
        });
        isMouseDown = false;
      }
      drawCircle();
      break;
    case "Rectangle":
      if (isMouseDown) {
        existingRectangles.push({
          startX: startX,
          startY: startY,
          endX: mouseX,
          endY: mouseY,
          height: Math.abs(mouseY - startY),
          width: Math.abs(mouseX - startX),
          color: myColor,
          thickness: myThickness,
          filling: myFill,
        });
        isMouseDown = false;
      }
      drawRectangle();
      break;
    case "Right triangle":
      if (isMouseDown) {
        existingTriangles.push({
          startX: startX,
          startY: startY,
          endX: mouseX,
          endY: mouseY,
          color: myColor,
          thickness: myThickness,
          filling: myFill,
        });
        isMouseDown = false;
      }
      drawRightTriangle();
      break;
    case "Star":
      if (isMouseDown) {
        existingStars.push({
          startX: startX,
          startY: startY,
          endX: mouseX,
          endY: mouseY,
          outerRadius: Math.abs(mouseY - startY),
          innerRadius: Math.abs(mouseY - startY) / 2,
          color: myColor,
          thickness: myThickness,
          filling: myFill,
        });
        isMouseDown = false;
      }
      drawStar();
      break;
    case "Cloud":
      if (isMouseDown) {
        existingClouds.push({
          startX: startX,
          startY: startY,
          endX: mouseX,
          endY: mouseY,
          radius: Math.abs(mouseY - startY),
          color: myColor,
          thickness: myThickness,
          filling: myFill,
        });
        isMouseDown = false;
      }
      drawCloud();
      break;
  }
}

function onMouseMoveHandler(e) {
  if (isMouseDown) {
    switch (myInstrument) {
      case "Pencil":
        existingPencilPoints.push({
          x: e.offsetX,
          y: e.offsetY,
          color: myColor,
          thickness: myThickness,
        });
        drawPencil(e);

        break;
      case "Eraser":
        mouseX = e.offsetX;
        mouseY = e.offsetY;
        if (isMouseDown) {
          existingErasePoints.push({
            startX: startX,
            startY: startY,
            endX: mouseX,
            endY: mouseY,
            thickness: myThickness,
          });
          doErase();
        }
        break;
      case "Straight line":
        mouseX = e.offsetX;
        mouseY = e.offsetY;
        if (isMouseDown) {
          drawLine();
        }
        break;
      case "Circle":
        mouseX = e.offsetX;
        mouseY = e.offsetY;
        if (isMouseDown) {
          drawCircle();
        }
        break;
      case "Rectangle":
        mouseX = e.offsetX;
        mouseY = e.offsetY;
        if (isMouseDown) {
          drawRectangle();
        }
        break;
      case "Right triangle":
        mouseX = e.offsetX;
        mouseY = e.offsetY;
        if (isMouseDown) {
          drawRightTriangle();
        }
        break;
      case "Star":
        mouseX = e.offsetX;
        mouseY = e.offsetY;
        if (isMouseDown) {
          drawStar();
        }
        break;
      case "Cloud":
        mouseX = e.offsetX;
        mouseY = e.offsetY;
        if (isMouseDown) {
          drawCloud();
        }
        break;
    }
  }
}

function onInputColorHandler(e) {
  myColor = this.value;
}

function onChangeThicknessHandler(e) {
  myThickness = parseInt(this.value);
}

function onChangeInstrumentsHandler(e) {
  myInstrument = this.value;
}

function onChangeFillHandler(e) {
  console.log(this.value);
}

function onClickClearHandler(e) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  existingLines = [];
  existingPencilPoints = [];
  existingCircles = [];
  existingRectangles = [];
  existingTriangles = [];
  existingStars = [];
  existingClouds = [];
}

function onClickSaveHandler(e) {
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.href = canvas.toDataURL();
  a.download = "canvas-image.png";
  a.click();
  document.body.removeChild(a);
}

//Figure and save

function drawPencil(e) {
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  if (myThickness != 1) {
    ctx.beginPath();
    ctx.fillStyle = myColor;
    ctx.arc(e.offsetX, e.offsetY, myThickness / 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  }
}

function drawPencilSave() {
  ctx.beginPath();
  for (let i = 0; i < existingPencilPoints.length; i++) {
    if (existingPencilPoints.length > 1) {
      ctx.strokeStyle = existingPencilPoints[i].color;
      ctx.lineWidth = existingPencilPoints[i].thickness;
      if (existingPencilPoints[i + 1] == false) {
        ctx.stroke();
        ctx.beginPath();
        continue;
      }
      if (existingPencilPoints[i] == false) {
        continue;
      }
      if (i == 0) {
        ctx.moveTo(existingPencilPoints[i].x, existingPencilPoints[i].y);
      }
      if (i != existingPencilPoints.length - 1) {
        ctx.lineTo(
          existingPencilPoints[i + 1].x,
          existingPencilPoints[i + 1].y
        );
      }
    }
  }
  ctx.closePath();
  ctx.stroke();
  existingPencilPoints.forEach((el) => {
    if (el.thickness != 1 && el != false) {
      ctx.beginPath();
      ctx.fillStyle = el.color;
      ctx.lineWidth = el.thickness;
      ctx.arc(el.x, el.y, el.thickness / 2, 0, 2 * Math.PI);
      ctx.fill();
    }
  });
}

function drawLine() {
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawPencilSave();
  drawCircleSave();
  drawRectangleSave();
  drawRightTriangleSave();
  drawStarSave();
  drawCloudSave();
  doErase();
  for (let i = 0; i < existingLines.length; ++i) {
    ctx.beginPath();
    let line = existingLines[i];
    ctx.strokeStyle = line.color;
    ctx.lineWidth = line.thickness;
    ctx.moveTo(line.startX, line.startY);
    ctx.lineTo(line.endX, line.endY);
    ctx.stroke();
  }

  if (isMouseDown && myInstrument == "Straight line") {
    ctx.strokeStyle = myColor;
    ctx.lineWidth = myThickness;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(mouseX, mouseY);
    ctx.stroke();
  }
}

function drawLineSave() {
  for (let i = 0; i < existingLines.length; ++i) {
    ctx.beginPath();
    let line = existingLines[i];
    ctx.strokeStyle = line.color;
    ctx.lineWidth = line.thickness;
    ctx.moveTo(line.startX, line.startY);
    ctx.lineTo(line.endX, line.endY);
    ctx.stroke();
    ctx.closePath();
  }
}

function drawCircle() {
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawPencilSave();
  drawLineSave();
  drawRectangleSave();
  drawRightTriangleSave();
  drawStarSave();
  drawCloudSave();
  doErase();
  for (let i = 0; i < existingCircles.length; ++i) {
    ctx.beginPath();
    let circle = existingCircles[i];
    ctx.arc(circle.startX, circle.startY, circle.radius, 0, 2 * Math.PI);
    ctx.lineWidth = circle.thickness;
    if (circle.filling == "solid") {
      ctx.strokeStyle = circle.color;
      ctx.stroke();
    } else {
      ctx.fillStyle = circle.color;
      ctx.fill();
    }
  }
  if (isMouseDown && myInstrument == "Circle") {
    ctx.beginPath();
    ctx.arc(startX, startY, Math.abs(mouseY - startY), 0, 2 * Math.PI);
    ctx.lineWidth = myThickness;
    if (myFill == "solid") {
      ctx.strokeStyle = myColor;
      ctx.stroke();
    } else {
      ctx.fillStyle = myColor;
      ctx.fill();
    }
  }
}

function drawCircleSave() {
  for (let i = 0; i < existingCircles.length; ++i) {
    ctx.beginPath();
    let circle = existingCircles[i];
    ctx.arc(circle.startX, circle.startY, circle.radius, 0, 2 * Math.PI);
    ctx.lineWidth = circle.thickness;
    if (circle.filling == "solid") {
      ctx.strokeStyle = circle.color;
      ctx.stroke();
    } else {
      ctx.fillStyle = circle.color;
      ctx.fill();
    }
  }
}

function drawRectangle() {
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawPencilSave();
  drawLineSave();
  drawCircleSave();
  drawRightTriangleSave();
  drawStarSave();
  drawCloudSave();
  doErase();
  for (let i = 0; i < existingRectangles.length; ++i) {
    let rectangle = existingRectangles[i];
    ctx.beginPath();
    ctx.rect(
      rectangle.startX,
      rectangle.startY,
      rectangle.width,
      rectangle.height
    );
    ctx.lineWidth = rectangle.thickness;
    if (rectangle.filling == "solid") {
      ctx.strokeStyle = rectangle.color;
      ctx.stroke();
    } else {
      ctx.fillStyle = rectangle.color;
      ctx.fill();
    }
  }
  if (isMouseDown && myInstrument == "Rectangle") {
    ctx.beginPath();
    ctx.rect(
      startX,
      startY,
      Math.abs(mouseX - startX),
      Math.abs(mouseY - startY)
    );
    if (myFill == "solid") {
      ctx.strokeStyle = myColor;
      ctx.stroke();
    } else {
      ctx.fillStyle = myColor;
      ctx.fill();
    }
  }
}

function drawRectangleSave() {
  for (let i = 0; i < existingRectangles.length; ++i) {
    let rectangle = existingRectangles[i];
    ctx.beginPath();
    ctx.rect(
      rectangle.startX,
      rectangle.startY,
      rectangle.width,
      rectangle.height
    );
    ctx.lineWidth = rectangle.thickness;
    if (rectangle.filling == "solid") {
      ctx.strokeStyle = rectangle.color;
      ctx.stroke();
    } else {
      ctx.fillStyle = rectangle.color;
      ctx.fill();
    }
  }
}

function drawRightTriangle() {
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawPencilSave();
  drawLineSave();
  drawCircleSave();
  drawRectangleSave();
  drawStarSave();
  drawCloudSave();
  doErase();
  for (let i = 0; i < existingTriangles.length; ++i) {
    let triangle = existingTriangles[i];
    ctx.strokeStyle = triangle.color;
    ctx.lineWidth = triangle.thickness;
    ctx.beginPath();
    ctx.moveTo(triangle.startX, triangle.endY);
    ctx.lineTo(triangle.startX, Math.abs(triangle.endY - triangle.startY));
    ctx.lineTo(triangle.endX, triangle.endY);
    ctx.lineTo(triangle.startX, triangle.endY);
    if (triangle.filling == "solid") {
      ctx.strokeStyle = triangle.color;
      ctx.stroke();
      drawHelpCircle(
        triangle.startX,
        Math.abs(triangle.endY - triangle.startY),
        triangle.thickness,
        triangle.color
      );
      drawHelpCircle(
        triangle.endX,
        triangle.endY,
        triangle.thickness,
        triangle.color
      );
      drawHelpCircle(
        triangle.startX,
        triangle.endY,
        triangle.thickness,
        triangle.color
      );
    } else {
      ctx.fillStyle = triangle.color;
      ctx.fill();
    }
  }
  if (isMouseDown && myInstrument == "Right triangle") {
    ctx.beginPath();
    ctx.moveTo(startX, mouseY);
    ctx.lineTo(startX, Math.abs(mouseY - startY));
    ctx.lineTo(mouseX, mouseY);
    ctx.lineTo(startX, mouseY);
    ctx.stroke();
    if (myFill == "solid") {
      ctx.strokeStyle = myColor;
      ctx.stroke();
      drawHelpCircle(startX, Math.abs(mouseY - startY), myThickness, myColor);
      drawHelpCircle(mouseX, mouseY, myThickness, myColor);
      drawHelpCircle(startX, mouseY, myThickness, myColor);
    } else {
      ctx.fillStyle = myColor;
      ctx.fill();
    }
    
  }
}

function drawRightTriangleSave() {
  for (let i = 0; i < existingTriangles.length; ++i) {
    let triangle = existingTriangles[i];
    ctx.strokeStyle = triangle.color;
    ctx.lineWidth = triangle.thickness;
    ctx.beginPath();
    ctx.moveTo(triangle.startX, triangle.endY);
    ctx.lineTo(triangle.startX, Math.abs(triangle.endY - triangle.startY));
    ctx.lineTo(triangle.endX, triangle.endY);
    ctx.lineTo(triangle.startX, triangle.endY);
    if (triangle.filling == "solid") {
      ctx.strokeStyle = triangle.color;
      ctx.stroke();
      drawHelpCircle(
        triangle.startX,
        Math.abs(triangle.endY - triangle.startY),
        triangle.thickness,
        triangle.color
      );
      drawHelpCircle(
        triangle.endX,
        triangle.endY,
        triangle.thickness,
        triangle.color
      );
      drawHelpCircle(
        triangle.startX,
        triangle.endY,
        triangle.thickness,
        triangle.color
      );
    } else {
      ctx.fillStyle = triangle.color;
      ctx.fill();
    }
  }
}

function drawStar() {
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawPencilSave();
  drawLineSave();
  drawCircleSave();
  drawRectangleSave();
  drawRightTriangleSave();
  drawCloudSave();
  doErase();
  for (let i = 0; i < existingStars.length; ++i) {
    let star = existingStars[i];
    drawSingleStar(
      star.startX,
      star.startY,
      star.color,
      star.thickness,
      star.outerRadius,
      star.innerRadius,
      star.filling
    );
  }
  if (isMouseDown && myInstrument == "Star") {
    drawSingleStar(
      startX,
      startY,
      myColor,
      myThickness,
      Math.abs(mouseY - startY),
      Math.abs(mouseY - startY) / 2,
      myFill
    );
  }
}

function drawStarSave() {
  for (let i = 0; i < existingStars.length; ++i) {
    let star = existingStars[i];
    drawSingleStar(
      star.startX,
      star.startY,
      star.color,
      star.thickness,
      star.outerRadius,
      star.innerRadius,
      star.filling
    );
  }
}

function drawCloud() {
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawPencilSave();
  drawLineSave();
  drawCircleSave();
  drawRectangleSave();
  drawRightTriangleSave();
  drawStar();
  doErase();
  for (let i = 0; i < existingClouds.length; ++i) {
    let cloud = existingClouds[i];
    drawSingleCloud(
      cloud.startX,
      cloud.startY,
      cloud.radius,
      cloud.color,
      cloud.thickness,
      cloud.filling
    );
  }
  if (isMouseDown && myInstrument == "Cloud") {
    drawSingleCloud(
      startX,
      startY,
      Math.abs(mouseY - startY),
      myColor,
      myThickness,
      myFill
    );
  }
}

function drawCloudSave() {
  for (let i = 0; i < existingClouds.length; ++i) {
    let cloud = existingClouds[i];
    drawSingleCloud(
      cloud.startX,
      cloud.startY,
      cloud.radius,
      cloud.color,
      cloud.thickness,
      cloud.filling
    );
  }
}

function doErase() {
  drawPencilSave();
  drawLineSave();
  drawRectangleSave();
  drawRightTriangleSave();
  drawStarSave();
  drawCloudSave();
  for (let i = 0; i < existingErasePoints.length; ++i) {
    let erasePoint = existingErasePoints[i];
    ctx.beginPath();
    ctx.arc(
      erasePoint.endX,
      erasePoint.endY,
      erasePoint.thickness / 2,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.lineWidth = erasePoint.thickness;
    ctx.beginPath();
    ctx.moveTo(erasePoint.startX, erasePoint.startY);
    ctx.lineTo(erasePoint.endX, erasePoint.endY);
    ctx.strokeStyle = "#FFFFFF";
    ctx.stroke();
  }
  if (isMouseDown && myInstrument == "Erase") {
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, myThickness / 2, 0, 2 * Math.PI);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.lineWidth = myThickness;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(mouseX, mouseY);
    ctx.strokeStyle = "#FFFFFF";
    ctx.stroke();
  }
}

//Help function
function drawHelpCircle(x, y, thickness, color) {
  if (thickness != 1) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.lineWidth = thickness;
    ctx.arc(x, y, thickness / 2, 0, 2 * Math.PI);
    ctx.fill();
  }
}

function drawSingleStar(
  cx,
  cy,
  color,
  thickness,
  outerRadius,
  innerRadius,
  fillStar
) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  let spikes = 5;
  let step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.lineWidth = thickness;
  if (fillStar == "solid") {
    ctx.strokeStyle = color;
    ctx.stroke();
  } else {
    ctx.fillStyle = color;
    ctx.fill();
  }
}

function drawSingleCloud(x, y, radius, color, thickness, fillCloud) {
  ctx.beginPath();
  ctx.arc(x, y, radius, Math.PI * 0.5, Math.PI * 1.5);
  ctx.arc(
    x + radius * 1.17,
    y - radius,
    radius * 1.17,
    Math.PI * 1,
    Math.PI * 1.85
  );
  ctx.arc(
    x + radius * 2.53,
    y - radius * 0.75,
    radius * 0.83,
    Math.PI * 1.37,
    Math.PI * 1.91
  );
  ctx.arc(x + radius * 3.33, y, radius, Math.PI * 1.5, Math.PI * 0.5);
  ctx.moveTo(x + radius * 3.33, y + radius);
  ctx.lineTo(x, y + radius);
  ctx.lineWidth = thickness;
  if (fillCloud == "solid") {
    ctx.strokeStyle = color;
    ctx.stroke();
  } else {
    ctx.fillStyle = color;
    ctx.fill();
  }
}

function checkFill() {
  [...fill].forEach((el) => {
    if (el.checked) {
      myFill = el.value;
    }
  });
}
