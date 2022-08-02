const cos = document.getElementById('console');

// Logging in a div
console.log = (...logs) => {
  for (const log of logs) {
    cos.innerHTML += (log + '<br/>');
  }
}

console.log("Hello World!");

// Starts Here!
const VIDEO = document.getElementById("camera-output");
const torchBotton = document.getElementById("toggel-torch");
const cameraSwitch = document.getElementById("camera-switch");

let torchOn = false;
const cameraData = {
  currentCamera: 0,
  cameras: [], 
};


if ('mediaDevices' in navigator) {
  startCamera();
} else {
  throw "No Media Device Found!";
}


async function startCamera() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  cameraData.cameras = devices.filter(device => device.kind === 'videoinput');

  if (cameraData.cameras.length === 0) {
    throw 'No camera found on this device.';
  }
  cameraData.currentCamera = cameraData.cameras.length - 1;
  const camera = cameraData.cameras[cameraData.currentCamera];

  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      deviceId: camera.deviceId,
      facingMode: ['user', 'environment']
    }
  });

  VIDEO.srcObject = stream;
  VIDEO.play();
  
  const track = stream.getVideoTracks()[0];
  
  if (track.getCapabilities().torch) {
    showTorch();
    torchBotton.onclick = () => {
      torchOn = !torchOn;
      track.applyConstraints({
        advanced: [{torch: torchOn}]
      });
    }
  } else hideTorch();
}

async function switchCamera() {
  for (const track of VIDEO.srcObject.getTracks())
    track.stop();
  
  if (cameraData.currentCamera <= 0)
    cameraData.currentCamera = cameraData.cameras.length - 1;
  else
    cameraData.currentCamera -= 1;
  
  const camera = cameraData.cameras[cameraData.currentCamera];

  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      deviceId: camera.deviceId,
      facingMode: ['user', 'environment']
    }
  });

  VIDEO.srcObject = stream;
  VIDEO.play();
  
  const track = stream.getVideoTracks()[0];
  
  if (track.getCapabilities().torch) {
    showTorch();
    torchBotton.onclick = () => {
      torchOn = !torchOn;
      track.applyConstraints({
        advanced: [{torch: torchOn}]
      });
    }
  } else hideTorch();
}

cameraSwitch.onclick = () => {
  switchCamera();
}

function hideTorch() {
  torchBotton.style.opacity = 0;
}

function showTorch() {
  torchBotton.style.opacity = 1;
}
