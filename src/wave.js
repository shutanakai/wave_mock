let unit = 100,
  canvasList, // キャンバスの配列
  info = {}, // 全キャンバス共通の描画情報
  colorList; // 各キャンバスの色情報

/**
 * Init function.
 *
 * Initialize variables and begin the animation.
 */
function init() {
  info.seconds = 0;
  info.t = 0;
  canvasList = [];
  colorList = ["#88CFEA", "#99E7FF", "#9CE8FF", "#88CFEA", "#C5F7FF"];

  canvasList.push(document.getElementById("waveCanvas"));

  canvasList.push(document.getElementById("waveCanvasBottom"));

  // 各キャンバスの初期化
  for (let canvasIndex in canvasList) {
    const canvas = canvasList[canvasIndex];
    canvas.contextCache = canvas.getContext("2d");
  }
  // 共通の更新処理呼び出し
  update();
}

function update() {
  for (let canvasIndex in canvasList) {
    const canvas = canvasList[canvasIndex];
    canvas.width = document.documentElement.clientWidth; //Canvasのwidthをウィンドウの幅に合わせる
    canvas.height = document.documentElement.clientHeight / 4; //波の高さ
    // 各キャンバスの描画
    draw(canvas, colorList);
  }
  // 共通の描画情報の更新
  info.seconds = info.seconds + 0.014;
  info.t = info.seconds * Math.PI;
  // 自身の再起呼び出し
  setTimeout(update, 35);
}

/**
 * Draw animation function.
 *
 * This function draws one frame of the animation, waits 20ms, and then calls
 * itself again.
 */
function draw(canvas, colorList) {
  // 対象のcanvasのコンテキストを取得
  const context = canvas.contextCache;
  // キャンバスの描画をクリア
  context.clearRect(0, 0, canvas.width, canvas.height);

  //波の重なりを描画 drawWave(canvas, color[数字（波の数を0から数えて指定）], 透過, 波の幅のzoom,波の開始位置の遅れ, 波の低さの割合 )
  if (window.innerWidth < 768) {
    drawWave(canvas, colorList[4], 0.4, 1.5, 0, 2);
    drawWave(canvas, colorList[3], 0.3, 2, 500, 3);
    drawWave(canvas, colorList[2], 0.2, 3, 2500, 4);
    drawWave(canvas, colorList[1], 0.2, 4, 2000, 5);
    drawWave(canvas, colorList[0], 0.3, 5, 1500, 6);
  } else {
    drawWave(canvas, colorList[4], 0.4, 5, 0, 1.5);
    drawWave(canvas, colorList[3], 0.3, 6, 500, 3);
    drawWave(canvas, colorList[2], 0.2, 7, 3100, 4.5);
    drawWave(canvas, colorList[1], 0.2, 8, 7100, 6);
    drawWave(canvas, colorList[0], 0.3, 9, 1400, 7.5);
  }
}

/**
 * 波を描画
 * drawWave(色, 不透明度, 波の幅のzoom, 波の開始位置の遅れ, 波の高さ)
 */
function drawWave(canvas, color, alpha, zoom, delay, heightRate) {
  const context = canvas.contextCache;
  context.fillStyle = color; //塗りの色
  context.globalAlpha = alpha;
  context.beginPath(); //パスの開始
  drawSine(canvas, info.t / 1.5, zoom, delay, heightRate);
  context.lineTo(canvas.width + 10, 0); // パスをCanvasの右上へ
  context.lineTo(0, 0); // パスをCanvasの左上へ
  context.closePath(); //パスを閉じる
  context.fill(); //塗りつぶす
}

/**
 * Function to draw sine
 *
 * The sine curve is drawn in 10px segments starting at the origin.
 * drawSine(時間, 波の幅のzoom, 波の開始位置の遅れ)
 */
function drawSine(canvas, t, zoom, delay, heightRate) {
  const xAxis = Math.floor(canvas.height / heightRate);
  const yAxis = 0;
  const context = canvas.contextCache;
  // Set the initial x and y, starting at 0,0 and translating to the origin on
  // the canvas.
  let x = t; //時間を横の位置とする
  let y = Math.sin(x) / zoom;
  context.moveTo(yAxis, unit * y + xAxis); //スタート位置にパスを置く

  // Loop to draw segments (横幅の分、波を描画)
  for (i = yAxis; i <= canvas.width + 10; i += 10) {
    x = t + (-yAxis + i) / unit / zoom;
    y = Math.sin(x - delay) / 3;
    context.lineTo(i, unit * y + xAxis);
  }
}

init();
