const canvas = document.querySelector("#heroScene");
const context = canvas.getContext("2d");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let width = 0;
let height = 0;
let dpr = 1;
let frame = 0;
let raf = 0;

function resize() {
  const rect = canvas.getBoundingClientRect();
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = Math.max(1, Math.floor(rect.width));
  height = Math.max(1, Math.floor(rect.height));
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  draw();
}

function drawGrid(tick) {
  const cell = width < 700 ? 34 : 46;
  context.save();
  context.globalAlpha = 0.34;
  context.strokeStyle = "rgba(244,239,229,0.08)";
  context.lineWidth = 1;

  const offset = reducedMotion.matches ? 0 : (tick % cell);

  for (let x = -cell + offset; x < width + cell; x += cell) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }

  for (let y = -cell + offset * 0.55; y < height + cell; y += cell) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }

  context.restore();
}

function drawCartridge(x, y, size, color, tick) {
  const lift = reducedMotion.matches ? 0 : Math.sin((tick + x) * 0.015) * 8;
  context.save();
  context.translate(x, y + lift);
  context.fillStyle = "rgba(8,9,13,0.72)";
  context.strokeStyle = "rgba(244,239,229,0.2)";
  context.lineWidth = 1;
  context.fillRect(0, 0, size * 0.74, size);
  context.strokeRect(0, 0, size * 0.74, size);
  context.fillStyle = color;
  context.fillRect(size * 0.1, size * 0.18, size * 0.54, size * 0.36);
  context.fillStyle = "rgba(244,239,229,0.72)";
  context.fillRect(size * 0.12, size * 0.68, size * 0.5, 3);
  context.fillRect(size * 0.12, size * 0.78, size * 0.32, 3);
  context.restore();
}

function drawHandheld(tick) {
  const scale = Math.min(width, height) / 720;
  const deviceWidth = Math.max(300, 460 * scale);
  const deviceHeight = deviceWidth * 0.64;
  const x = width - deviceWidth * 0.92;
  const y = height * 0.45 - deviceHeight / 2;

  context.save();
  context.translate(x, y);
  context.rotate(-0.04);
  context.fillStyle = "rgba(18,19,27,0.96)";
  context.strokeStyle = "rgba(232,164,92,0.42)";
  context.lineWidth = 2;
  roundRect(0, 0, deviceWidth, deviceHeight, 18);
  context.fill();
  context.stroke();

  context.fillStyle = "#08090d";
  context.strokeStyle = "rgba(244,239,229,0.16)";
  roundRect(deviceWidth * 0.22, deviceHeight * 0.14, deviceWidth * 0.52, deviceHeight * 0.62, 8);
  context.fill();
  context.stroke();

  const pulse = reducedMotion.matches ? 0 : Math.sin(tick * 0.04) * 0.08 + 0.92;
  context.fillStyle = `rgba(88,214,201,${pulse})`;
  context.fillRect(deviceWidth * 0.27, deviceHeight * 0.22, deviceWidth * 0.42, deviceHeight * 0.14);
  context.fillStyle = "rgba(232,164,92,0.9)";
  context.fillRect(deviceWidth * 0.27, deviceHeight * 0.42, deviceWidth * 0.22, deviceHeight * 0.08);
  context.fillStyle = "rgba(239,111,115,0.9)";
  context.fillRect(deviceWidth * 0.52, deviceHeight * 0.56, deviceWidth * 0.16, deviceHeight * 0.08);

  context.fillStyle = "rgba(244,239,229,0.72)";
  context.fillRect(deviceWidth * 0.1, deviceHeight * 0.42, deviceWidth * 0.08, deviceHeight * 0.025);
  context.fillRect(deviceWidth * 0.128, deviceHeight * 0.34, deviceWidth * 0.025, deviceHeight * 0.18);
  context.beginPath();
  context.arc(deviceWidth * 0.82, deviceHeight * 0.4, deviceWidth * 0.035, 0, Math.PI * 2);
  context.arc(deviceWidth * 0.9, deviceHeight * 0.5, deviceWidth * 0.035, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function roundRect(x, y, w, h, radius) {
  const r = Math.min(radius, w / 2, h / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + w, y, x + w, y + h, r);
  context.arcTo(x + w, y + h, x, y + h, r);
  context.arcTo(x, y + h, x, y, r);
  context.arcTo(x, y, x + w, y, r);
  context.closePath();
}

function draw() {
  context.clearRect(0, 0, width, height);
  context.fillStyle = "#08090d";
  context.fillRect(0, 0, width, height);

  drawGrid(frame);

  const colors = [
    "rgba(232,164,92,0.88)",
    "rgba(88,214,201,0.82)",
    "rgba(239,111,115,0.78)",
    "rgba(139,124,246,0.76)"
  ];

  for (let i = 0; i < 18; i += 1) {
    const lane = i % 6;
    const size = 48 + (i % 4) * 14;
    const x = width * 0.42 + ((i * 127 + frame * (0.18 + lane * 0.03)) % Math.max(width * 0.75, 1));
    const y = 82 + lane * (height / 7.2);
    drawCartridge(x, y, size, colors[i % colors.length], frame);
  }

  drawHandheld(frame);
  frame += 1;

  if (!reducedMotion.matches) {
    raf = requestAnimationFrame(draw);
  }
}

function start() {
  cancelAnimationFrame(raf);
  resize();
  if (!reducedMotion.matches) {
    raf = requestAnimationFrame(draw);
  }
}

window.addEventListener("resize", resize, { passive: true });
reducedMotion.addEventListener("change", start);
start();
