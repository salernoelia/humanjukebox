function scene1() {
  image(img1, 0, 0, window.innerWidth, window.innerHeight);
  if (handsVisible.value === true) {
    sceneMap.set("scene1", true);
    console.log("scene 1 is trying to call timer", scene1Timer);
    if (scene1Timer === false) {
      timer1 = setTimeout(function () {
        console.log("Timer in Sc 1 is called", timer1);
        mode = 2;
        timer1 = millis();
      }, 3000);
      scene1Timer = true;
    }
  }
}
function scene2() {
  image(img2, 0, 0, window.innerWidth, window.innerHeight);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(86);

  elapsedTime = (millis() - conditionMetTime) / 1000;

  let str = elapsedTime.toFixed(1);
  text(str, window.innerWidth / 2, window.innerHeight / 1.1);

  if (resetTimer === false) {
    console.log("Reset Timer in Sc 2 is called", resetTimer);

    startTimer();
    resetTimer = true;
  }
  if (checkConditions() === true) {
    sceneMap.set("scene2", true);
    resetTimer = false;
    startTime = 0;
    timer1 = millis();
    mode = 3;
  } else if (millis() - startTime > 15000 && checkConditions() === false) {
    startTime = 0;
    scene1Timer = false;
    resetTimer = false;
    mode = 1;
  }
}
function scene3() {
  background(0);

  if (recorderStarted === false) {
    Tone.Transport.start();
    Tone.Transport.scheduleRepeat(setMelody, "4n");
    recorder.start();
    console.log("Recording");
    sceneMap.set("scene3", true);
    mode = 4;
    recorderStarted = true;
  }
}

function scene4() {
  if (resetTimer === false) {
    console.log("resetTimer for startTimer in Sc 4 is called", resetTimer);
    startTimer();
    resetTimer = true;
  }

  if (millis() - startTime > 30000) {
    if (recorderStarted === true) {
      console.log("Scene 4 startTimer is called after", millis() - startTime);
      Tone.Transport.stop();
      Tone.Transport.cancel();
      recorder.stop();
      console.log("Stopped Recording:", chunks);
      saveAction();
      scene5Timer = false;
      console.log("scene 5timer set to (false)", false);
      recorderStarted = false;
      console.log("Recorder Started is Deactivated (false)", recorderStarted);
      mode = 5;
      startTime = 0;
      resetTimer = false;
    }
  }

  calculateDistance();
  xR = map(rightHandIndexX.value, 1, 0, 0, window.innerWidth);
  yR = map(rightHandIndexY.value, 0, 1, 0, window.innerHeight);

  xRt = map(rightHandThumbX.value, 1, 0, 0, window.innerWidth);
  yRt = map(rightHandThumbY.value, 0, 1, 0, window.innerHeight);

  xL = map(leftHandIndexX.value, 1, 0, 0, window.innerWidth);
  yL = map(leftHandIndexY.value, 0, 1, 0, window.innerHeight);

  xLt = map(leftHandThumbX.value, 1, 0, 0, window.innerWidth);
  yLt = map(leftHandThumbY.value, 0, 1, 0, window.innerHeight);

  //--Instrument_R Controls
  let lowpassFreq = map(yR, window.innerHeight, 0, 200, 1000);
  lowpassR.frequency.value = lowpassFreq;

  let instrumentRVol = map(yR, window.innerHeight, 0, -5, 0);
  instrumentR.volume.value = instrumentRVol;

  const lfoFrequency = map(xR, 0, window.innerWidth, 0, 10);
  filterR.frequency.value = lfoFrequency;

  //--Instrument_L Controls
  let instrumentLFreq = map(yL, window.innerHeight, 0, 200, 2000);
  lowpassL.frequency.value = instrumentLFreq;

  let instrumentLVol = map(yL, window.innerHeight, 0, -5, 0);
  instrumentL.volume.value = instrumentLVol;

  const lfoFreq = map(xL, 0, window.innerWidth, 0, 10);
  filterL.frequency.value = lfoFreq;

  // ---Visuals
  if (
    (rightHandIndexX.value &&
      rightHandIndexY.value &&
      rightHandThumbX.value &&
      rightHandThumbY.value) ||
    (leftHandIndexX.value &&
      leftHandIndexY.value &&
      leftHandThumbX.value &&
      leftHandThumbY.value)
  ) {
    // Check if the index finger and thumb are pinched for either hand
    if (
      // Check for right hand
      (rightHandIndexX.value &&
        calculateDistance(
          rightHandIndexX.value,
          rightHandIndexY.value,
          rightHandThumbX.value,
          rightHandThumbY.value
        ) <= 0.05) ||
      // Check for left hand
      (leftHandIndexX.value &&
        calculateDistance(
          leftHandIndexX.value,
          leftHandIndexY.value,
          leftHandThumbX.value,
          leftHandThumbY.value
        ) <= 0.05)
    ) {
      for (let x = 0; x < window.innerWidth; x += spaceX) {
        for (let y = 0; y < window.innerHeight; y += spaceY) {
          let d = dist(xR, yR, x, y);
          if (d < 25) {
            let r = map(yR, 0, window.innerHeight, 200, 255);
            let g = map(yR, 0, window.innerHeight, 30, 130);
            let b = map(yR, 0, window.innerHeight, 0, 0);
            fill(r, g, b);
            diam = map(d, 0, 45, 30, 1);
            noStroke();
            ellipse(x, y, diam);
          }
        }
      }

      for (let x = 0; x < window.innerWidth; x += spaceX) {
        for (let y = 0; y < window.innerHeight; y += spaceY) {
          let d = dist(xL, yL, x, y);
          if (d < 25) {
            let r = map(yL, window.innerHeight, 0, 10, 90);
            let g = map(yL, window.innerHeight, 0, 10, 100);
            let b = map(yL, window.innerHeight, 0, 180, 255);
            fill(r, g, b);
            diam = map(d, 0, 45, 30, 1);
            noStroke();
            ellipse(x, y, diam);
          }
        }
      }
    }
  }
}
function scene5() {
  image(img3, 0, 0, window.innerWidth, window.innerHeight);

  timer1 = millis();

  if (scene5Timer === false) {
    scene1Timer = false;
    console.log(
      "SceneTimer1 is Deactivated (false) in timer block",
      scene1Timer
    );

    timer1 = setTimeout(function () {
      console.log(" Timer in Sc 5 is called", timer1);
      mode = 1;
      console.log("Scene 5 Timer is Deactivated (true)", scene5Timer);
    }, 5000);
    scene5Timer = true;
  }
}

function calculateDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
