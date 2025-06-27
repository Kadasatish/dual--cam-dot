const gun = Gun("https://gun-manhattan.herokuapp.com/gun");

// GUN references
const dotRef = gun.get("dotToggleSync");
const camRef = gun.get("camSwitchSync");

// DOM elements
const dotToggle = document.getElementById("dotToggle");
const camSwitch = document.getElementById("camSwitch");
const dot = document.getElementById("dot");
const video = document.getElementById("video");

let stream = null;

// DOT toggle: write
dotToggle.addEventListener("change", () => {
  const state = dotToggle.checked ? "on" : "off";
  dotRef.put({ state });
});

// DOT toggle: read
dotRef.on(data => {
  if (!data || !data.state) return;
  const isOn = data.state === "on";
  dot.style.backgroundColor = isOn ? "white" : "black";
  dotToggle.checked = isOn;
});

// Camera switch: write
camSwitch.addEventListener("input", () => {
  camRef.put({ mode: camSwitch.value });
});

// Camera switch: read
camRef.on(data => {
  if (!data || !data.mode) return;
  const mode = parseInt(data.mode);
  camSwitch.value = mode;

  if (mode === 0) startCamera("environment");
  else if (mode === 2) startCamera("user");
  else stopCamera();
});

// Start cam
function startCamera(facing) {
  if (stream) stopCamera();

  navigator.mediaDevices.getUserMedia({
    video: { facingMode: { exact: facing } },
    audio: false
  }).then(s => {
    stream = s;
    video.srcObject = stream;
    video.style.display = "block";
  }).catch(err => {
    console.error("Cam error:", err);
  });
}

// Stop cam
function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(t => t.stop());
    stream = null;
  }
  video.style.display = "none";
}
