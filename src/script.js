let modelLoaded = false;
let soundPlayed = false;

const sceneEl = document.querySelector('a-scene');
sceneEl.addEventListener('arReady', (event) => {
    console.log("MindAR is ready")
});
sceneEl.addEventListener('targetFound', (event) => {
    console.log("Target found");
    modelLoaded = true;
    soundPlayed = false;
    updateModel();
});
sceneEl.addEventListener('targetLost', (event) => {
    console.log("Target lost");
    soundPlayed = true;
});

const muteButton = document.getElementById('muteButton');
const soundEffect = document.querySelector('#soundEffect');
soundEffect.muted = true;
muteButton.addEventListener('click', function() {
    if (soundEffect.muted) {
    soundEffect.muted = false;
    console.log("sound muted off");
    muteButton.textContent = "ミュート中";
    } else {
    soundEffect.muted = true;
    console.log("sound muted on");
    muteButton.textContent = "ミュート解除";
    }
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // 上限は除き、下限は含む
}

function updateModel() {
    if (modelLoaded) {
    console.log("Updating model");
    // 効果音
    if (!soundPlayed && !soundEffect.muted) {
        soundPlayed = true;
        soundEffect.play();
    }

    // モデル表示
    var randInt = 0;
    console.log("Selected model index: : " + randInt);
    const models = [
        document.querySelector('#model0'),
    ];
    
    models.forEach((model, idx) => {
        const isVisible = idx === randInt;
        console.log(`Model ${idx} visibility: ${isVisible}`);
        model.setAttribute('visible', isVisible);
        if (model.object3D) {
        model.object3D.visible = isVisible;
        }
    });
    
    // モデルの動き
    move();

    // フォトフレーム表示
    const photoFrameOverlay = document.getElementById('photo-frame-overlay');
    photoFrameOverlay.style.display = 'block';

    // モデル表示の確認
    /*
    setTimeout(() => {
        models.forEach((model, idx) => {
        console.log(`Model ${idx} actual visibility: ${model.getAttribute('visible')}`);
        if (model.object3D) {
            console.log(`Model ${idx} object3D visibility: ${model.object3D.visible}`);
        }
        });
    }, 100);
    */
    }
}

function move() {
    const penguin = document.querySelector('a-gltf-model'); ;
    let position = 0;
    const speed = 0.001;
    let direction = 1;

    function animate() {
      position += speed * direction;
      // console.log("position", position, direction);

      // 位置が範囲を超えた場合、方向を反転
      if (position > 0.2 || position < -0.2) {
        direction *= -1;
      }

      // モデルの位置を更新
      if (penguin && penguin.object3D) {
        penguin.object3D.position.z = position;
        penguin.object3D.position.y = position;
      }
      // console.log(penguin)
      requestAnimationFrame(animate);
    }

    animate();
}

//　スクリーンショット
var image = document.querySelector("#snap");
var take_photo_btn = document.querySelector("#take-photo");
var delete_photo_btn = document.querySelector("#delete-photo");
var download_photo_btn = document.querySelector("#download-photo");

//スナップショットボタン
take_photo_btn.addEventListener("click", function (e) {
  console.log("take_photo_btn clicked");
  e.preventDefault();
  var video = document.querySelector("video");
  var snap = takeSnapshot(video);

  //スナップショット表示.
  image.setAttribute("src", snap);
  image.classList.add("visible");

  // 削除ボタンと保存ボタン有効
  delete_photo_btn.classList.remove("disabled");
  download_photo_btn.classList.remove("disabled");

  // 保存ボタンにスナップショットを渡す
  download_photo_btn.href = snap;
});

//削除ボタン
delete_photo_btn.addEventListener("click", function (e) {
  e.preventDefault();

  // スナップショットを隠す
  image.setAttribute("src", "");
  image.classList.remove("visible");

  // 削除ボタンと保存ボタン無効
  delete_photo_btn.classList.add("disabled");
  download_photo_btn.classList.add("disabled");
});

//スナップショットを撮る
function takeSnapshot(video) {
  var resizedCanvas = document.createElement("canvas");
  var resizedContext = resizedCanvas.getContext("2d");
  var width = video.videoWidth;
  var height = video.videoHeight;
  var aScene = document
    .querySelector("a-scene")
    .components.screenshot.getCanvas("perspective");

  if (width && height) {
    //videoのサイズをキャンバスにセット
    resizedCanvas.width = width;
    resizedCanvas.height = height;
    //キャンバスにvideoをコピー
    resizedContext.drawImage(video, 0, 0, width, height);

    //カメラの画角でar側の縮小処理を変える
    if (width > height) {
      // 横長（PC)
      resizedContext.drawImage(aScene, 0, 0, width, height);
    } else {
      // 縦長（スマホ）
      resizedContext.drawImage(aScene, 0, 0, width, (width/photoFrame.width)*aScene.height);
    }
    // photoFrame.pngの読み込みと描画
    resizedContext.drawImage(photoFrame, 0, 0, width, (width/photoFrame.width)*photoFrame.height);
    // header.pngの読み込みと描画
    resizedContext.drawImage(header, 0, 0, width, (width/header.width)*header.height);

    return resizedCanvas.toDataURL("image/png");
  }
}