let handData = { value: {} };
let leftHandIndexX = { value: 0 };
let leftHandIndexY = { value: 0 };
let leftHandIndexZ = { value: 0 };
let rightHandIndexX = { value: 0 };
let rightHandIndexY = { value: 0 };
let rightHandIndexZ = { value: 0 };
let leftHandThumbX = { value: 0 };
let leftHandThumbY = { value: 0 };
let leftHandThumbZ = { value: 0 };
let rightHandThumbX = { value: 0 };
let rightHandThumbY = { value: 0 };
let rightHandThumbZ = { value: 0 };

const ws = new WebSocket("ws://localhost:8081");

ws.onopen = () => {
  console.log("Connected to WebSocket server");
};

ws.onmessage = async function (event) {
  const parsedData = JSON.parse(event.data);
  console.log(parsedData); // Check the received data structure

  const hand = parsedData.hand;
  const indexX = parsedData[`${hand}-index`].x;
  const indexY = parsedData[`${hand}-index`].y;
  const indexZ = parsedData[`${hand}-index`].z;
  const thumbX = parsedData[`${hand}-thumb`].x;
  const thumbY = parsedData[`${hand}-thumb`].y;
  const thumbZ = parsedData[`${hand}-thumb`].z;

  // Update your UI or do whatever you need with the data here
  if (hand === "right") {
    leftHandIndexX.value = indexX;
    leftHandIndexY.value = indexY;
    leftHandIndexZ.value = indexZ;
    leftHandThumbX.value = thumbX;
    leftHandThumbY.value = thumbY;
    leftHandThumbZ.value = thumbZ;
  } else if (hand === "left") {
    rightHandIndexX.value = indexX;
    rightHandIndexY.value = indexY;
    rightHandIndexZ.value = indexZ;
    rightHandThumbX.value = thumbX;
    rightHandThumbY.value = thumbY;
    rightHandThumbZ.value = thumbZ;
  }

  return (
    leftHandIndexX.value,
    leftHandIndexY.value,
    leftHandIndexZ.value,
    rightHandIndexX.value,
    rightHandIndexY.value,
    rightHandIndexZ.value,
    leftHandThumbX.value,
    leftHandThumbY.value,
    leftHandThumbZ.value,
    rightHandThumbX.value,
    rightHandThumbY.value,
    rightHandThumbZ.value
  );
};

ws.onerror = (error) => {
  console.error("WebSocket error: ", error);
};

ws.onclose = () => {
  console.log("WebSocket connection closed");
};
Tone.Master.volume.value = -10;

// // ---Bandpass
let bandpass = new Tone.Filter({
  type: "bandpass",
  frequency: 300,
  Q: 1,
}).toMaster();

//---Base Synth
let synth = new Tone.DuoSynth({
  envelope: {
    attack: 0.01,
    decay: 0.1,
    sustain: 0.6,
    release: 1,
  },
}).connect(bandpass);

synth.volume.value = -20;

let lowpassCello = new Tone.Filter({
  type: "lowpass",
  frequency: 150,
  Q: 1,
}).toMaster();

//--Piano Filters
const filter = new Tone.AutoFilter({
  frequency: 5,
  depth: 0.9,
})
  .toMaster()
  .start();

let lowpass = new Tone.Filter({
  type: "lowpass",
  frequency: 150,
  Q: 1,
}).connect(filter);

const monoSynth = new Tone.Sampler({
  G1: "./samples/contrabass/G1.ogg",
}).connect(lowpass);
monoSynth.volume.value = -5;

const cello = new Tone.Sampler(
  {
    A2: "./samples/cello/A2.ogg",
    A3: "./samples/cello/A3.ogg",
  },
  { portamento: 0 }
).connect(lowpassCello);

let generateButton;
let playButton;
let saveButton;

let root = 48;
let scale = [
  [0, 2, 4, 5, 7, 9, 11, 12], //Dur Major
];

let scaleNames = ["Major"];

let selectedScale = scale[0];
let selectScale;
let numNotes = 8;
let melody = [];

let beat;
let prevX;
let prevY;

let n;
let note;

let pt = [];
let x = 8;
let y = 192;

let speed = 0;
let speedL = 0;
const easing = 0.03;

const partSize = 5;
let particles = [];
const resolution = 10;
const color = "blue";

const max_force = 5;
const min_force = 0;

function preload() {
  selectedScale = 0;
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  generateMelody();
  setTimeSig(8);
  generateButton = createButton("random");
  generateButton.position(0, 10);
  generateButton.mousePressed(generateMelody);

  playButton = createButton("play");
  playButton.position(60, 10);
  playButton.mousePressed(playMelody);

  saveButton = createButton("save");
  saveButton.position(100, 10);
  saveButton.mousePressed(saveAction);

  // spawnParticles()

  toggleFullscreen = () => {
    const fs = !fullscreen();
    fullscreen(fs);
    background(backgroundColor);
  };

  clearSketch = () => {
    background(backgroundColor);
  };

  pxR = null;
  pyR = null;

  pxL = null;
  pyL = null;

  //    save = async () => {
  //      await pg.save("sketch.png");
  //      pg.background(backgroundColor);
  //      background(backgroundColor);
  //    };

  //    toggleFullscreen = () => {
  //      const fs = !fullscreen();
  //      fullscreen(fs);
  //      pg.background(backgroundColor);
  //      background(backgroundColor);
  //    };

  //    clearSketch = () => {
  //      pg.background(backgroundColor);
  //      background(backgroundColor);
  //    };
}

function draw() {
  xR = map(rightHandIndexX.value, 1, 0, 0, window.innerWidth);
  yR = map(rightHandIndexY.value, 0, 1, 0, window.innerHeight);

  let target = dist(xR, yR, pxR, pyR);
  speed += (target - speed) * easing;
  if (pxR !== null && pyR !== null) {
    stroke(255, 0, 0);
    strokeWeight(speed / 2);
    line(xR, yR, pxR, pyR);
  }

  xL = map(leftHandIndexX.value, 1, 0, 0, window.innerWidth);
  yL = map(leftHandIndexY.value, 0, 1, 0, window.innerHeight);

  let targetL = dist(xL, yL, pxL, pyL);
  speedL += (targetL - speedL) * easing;

  if (pxL !== null && pyL !== null) {
    stroke(0, 255, 0);
    strokeWeight(speedL / 2);
    line(xL, yL, pxL, pyL);
  }

  //--Piano Controls
  let lowpassFreq = map(yR, window.innerHeight, 0, 200, 1000);
  lowpass.frequency.value = lowpassFreq;

  const lfoFrequency = map(xR, 0, window.innerWidth, 0, 15);
  filter.frequency.value = lfoFrequency;

  //--Cello Controls
  let celloFreq = map(yL, window.innerHeight, 0, 200, 1000);
  lowpassCello.frequency.value = celloFreq;

  pxR = xR;
  pyR = yR;

  pxL = xL;
  pyL = yL;
}

function thisScale() {
  selectedScale = selectScale.value();
  generateMelody();
}

function melodyIndex(note) {
  let melIndex = note - root;
  return scale[selectedScale].indexOf(melIndex);
}

function setTimeSig(ts) {
  Tone.Transport.timeSignature = [ts, 4];
}

// Start & Stop isch e chli am inneschisse
function playMelody() {
  if (Tone.Transport.state == "started") {
    background("black");
    Tone.Transport.stop();
    Tone.Transport.cancel();
    playButton.html("play");
  } else {
    Tone.Transport.cancel();
    background("black");
    Tone.Transport.scheduleRepeat(setMelody, "4n");
    Tone.Transport.start();
    playButton.html("stop");
  }
}
const notes = ["C3", "E3", "G3"];
function setMelody() {
  beat = Tone.Transport.position.split(":")[1];
  let midiNote = Tone.Frequency(melody[beat], "midi");
  synth.triggerAttackRelease(midiNote);
  monoSynth.triggerAttackRelease(midiNote);

  cello.triggerAttackRelease(midiNote);
}

function generateMelody() {
  background("black");
  melody = [];
  beat = 0;
  if (melody.length == numNotes) {
    melody.splice(0, melody.length);
  }
  for (let i = 0; i < numNotes; i++) {
    n = int(random(scale[selectedScale].length));
    note = root + scale[selectedScale][n];
    melody.push(note);
  }
}

const saveAction = async () => {
  await save("sketch.png");
  console.log("Saved");
  saveSketch();
};