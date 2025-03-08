// =============== 전역 변수 및 초기 설정 ===============
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let isDrawing = false;         // 마우스/터치 드로잉 중인지 여부
let currentColor = "#000000";  // 기본 색상 (검정)
let brushSize = 5;            // 기본 브러시 두께
let currentTool = "brush";     // 현재 도구: brush, eraser 중
let lastX = 0, lastY = 0;      // 이전 좌표(드로잉 경로 연결용)

// =============== 도구 아이콘(버튼) 요소 가져오기 ===============
const brushTool = document.getElementById("brushTool");
const eraserTool = document.getElementById("eraserTool");
const paletteTool = document.getElementById("paletteTool");
const colorPicker = document.getElementById("colorPicker");
const brushSizeRange = document.getElementById("brushSizeRange");
const clearCanvasBtn = document.getElementById("clearCanvasBtn");


// 브러시 버튼
brushTool.addEventListener("click", () => {
  currentTool = "brush";
  console.log("브러시 모드");
});

// 지우개 버튼
eraserTool.addEventListener("click", () => {
  currentTool = "eraser";
  console.log("지우개 모드");
});

// 팔레트 아이콘(색 선택)
paletteTool.addEventListener("click", () => {
  // 팔레트 아이콘 클릭 시 colorPicker 표시/숨김
  if (colorPicker.style.display === "none") {
    colorPicker.style.display = "inline-block";
  } else {
    colorPicker.style.display = "none";
  }
});

// 컬러 피커로 색 선택 시
colorPicker.addEventListener("input", (e) => {
  currentColor = e.target.value;
  console.log("색상 변경:", currentColor);
  // 팔레트 선택 후 자동으로 브러시 모드로 전환
  currentTool = "brush";
});

// 브러시 사이즈 변경 시
brushSizeRange.addEventListener("input", (e) => {
  brushSize = e.target.value;
  console.log("브러시 사이즈:", brushSize);
});

// 전체 지우기 버튼
clearCanvasBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// =============== 마우스 이벤트 ===============
canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", () => (isDrawing = false));
canvas.addEventListener("mouseout", () => (isDrawing = false));

// =============== 터치 이벤트 (모바일/태블릿) ===============
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  lastX = touch.clientX - rect.left;
  lastY = touch.clientY - rect.top;
  isDrawing = true;
});

canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  if (!isDrawing) return;
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;
  drawLine(lastX, lastY, x, y);
  [lastX, lastY] = [x, y];
});

canvas.addEventListener("touchend", () => (isDrawing = false));

// =============== 실제 드로잉 처리 함수 ===============
function draw(e) {
  if (!isDrawing) return;
  const x = e.offsetX;
  const y = e.offsetY;
  drawLine(lastX, lastY, x, y);
  [lastX, lastY] = [x, y];
}

function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();

  if (currentTool === "eraser") {
    // 지우개 모드: 흰색으로 그리는 방법
    ctx.strokeStyle = "#ffffff"; 
  } else {
    // 브러시 모드
    ctx.strokeStyle = currentColor;
  }

  ctx.lineWidth = brushSize;
  ctx.lineCap = "round";
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.closePath();
}

// =============== (1) 갤러리에 저장 & 삭제 기능 추가 ===============
// 저장 버튼: 이미지 저장 후 팝업 열기
saveBtn.addEventListener("click", function () {
  const imageData = canvas.toDataURL("image/png");
  saveToGallery(imageData);
  showPopup();
});

// 갤러리에 이미지 추가
function saveToGallery(imageData) {
  const galleryDiv = document.getElementById("gallery");

  // 이미지 감쌀 컨테이너
  const container = document.createElement("div");
  container.style.display = "inline-block";
  container.style.position = "relative";
  container.style.margin = "5px";
  
  // 이미지 요소
  const imgElement = document.createElement("img");
  imgElement.src = imageData;
  imgElement.width = 100;
  imgElement.height = 100;
  
  // (주석) 삭제 버튼 추가
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "삭제";
  deleteBtn.className = "delete-btn"; // (주석) 스타일 적용을 위해 CSS 클래스 지정

  // (주석) 삭제 버튼 클릭 시 해당 이미지 삭제
  deleteBtn.addEventListener("click", function () {
    galleryDiv.removeChild(container);
  });

  // (주석) 컨테이너에 이미지와 삭제 버튼 삽입
  container.appendChild(imgElement);
  container.appendChild(deleteBtn);
  
  galleryDiv.appendChild(container);
}

// 팝업 메시지 표시
function showPopup() {
  document.getElementById("popup").style.display = "block";
}

// 확인 버튼 클릭 시 팝업 닫기 & 캔버스 초기화
document.getElementById("closePopup").addEventListener("click", function () {
  document.getElementById("popup").style.display = "none";
  clearCanvas();
});

// 캔버스 초기화
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// 갤러리 버튼 클릭 시 팝업 열기
document.getElementById("galleryBtn").addEventListener("click", function () {
  document.getElementById("galleryPopup").style.display = "block";
});

// 갤러리 닫기 버튼
document.getElementById("closeGallery").addEventListener("click", function () {
  document.getElementById("galleryPopup").style.display = "none";
});


