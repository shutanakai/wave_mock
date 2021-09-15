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
  colorList = [];

  canvasList.push(document.getElementById("waveCanvas"));
  colorList.push(["#d4f1ff"]);

  canvasList.push(document.getElementById("waveCanvasBottom"));
  colorList.push(["#d4f1ff"]);

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
    draw(canvas, colorList[canvasIndex]);
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
function draw(canvas, color) {
  // 対象のcanvasのコンテキストを取得
  const context = canvas.contextCache;
  // キャンバスの描画をクリア
  context.clearRect(0, 0, canvas.width, canvas.height);

  //波の重なりを描画 drawWave(canvas, color[数字（波の数を0から数えて指定）], 透過, 波の幅のzoom,波の開始位置の遅れ, 波の低さの割合 )
  drawWave(canvas, color[0], 0.3, 3, 0, 1.5);
  drawWave(canvas, color[1], 0.4, 3, 100, 2);
  drawWave(canvas, color[2], 0.5, 3, 500, 2.5);
}

// function drawBottom(canvas, color) {
//   // 対象のcanvasのコンテキストを取得
//   const context = canvas.contextCache;
//   // キャンバスの描画をクリア
//   context.clearRect(0, 0, canvas.width, canvas.height);

//   //波の重なりを描画 drawWaveBottom(canvas, color[数字（波の数を0から数えて指定）], 透過, 波の幅のzoom,波の開始位置の遅れ, 波の低さの割合 )
//   drawWave(canvas, color[0], 0.3, 3, 0, 1.5, "bottom");
//   drawWave(canvas, color[1], 0.4, 3, 100, 2, "bottom");
//   drawWave(canvas, color[2], 0.5, 3, 500, 2.5, "bottom");
// }

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
  context.lineTo(canvas.width + 10, canvas.height); // パスをCanvasの右下へ
  context.lineTo(0, canvas.height); // パスをCanvasの左下へ
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
