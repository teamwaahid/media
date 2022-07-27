const video = document.getElementById('video');
const muteBtn = document.getElementById('mute_btn');
const cameraOff = document.getElementById('cameraOff');
const selectCam = document.getElementById('selectCam');
const selectMic = document.getElementById('selectMic');
const shareScreen = document.getElementById('shareScreen');

let mediaStream;
let mute = false;
let camera = true;
let currentCamera;

muteBtn.addEventListener('click', e => {
  if (mute) {
    mute = false;
    muteBtn.textContent = 'Mute';
    mediaStream.getAudioTracks().forEach(tracks => {
      track.enabled = true;
    });
  } else {
    mute = true;
    muteBtn.textContent = 'Unmute';
    mediaStream.getAudioTracks().forEach(tracks => {
      track.enabled = false;
    });
  }
});

cameraOff.addEventListener('click', () => {
  if (camera) {
    cameraOff.textContent = 'Turn On Camera';
    camera = false;
    mediaStream.getVideoTracks().forEach(track => {
      track.enabled = false;
    });
  } else {
    cameraOff.textContent = 'Turn Off Camera';
    camera = true;
    mediaStream.getVideoTracks().forEach(track => {
      track.enabled = true;
    });
  }
});

// geting media
async function getMedia(cameraId, micId) {
  currentCamera = cameraId === null ? currentCamera : cameraId;

  const initialConstraits = {
    video: true,
    audio: true,
  };

  const preferredCameraConstraits = {
    video: { deviceId: cameraId },
    audio: true,
  };

  const videoOption = currentCamera ? { deviceId: currentCamera } : true;

  const preferredmicConstraits = {
    video: true,
    audio: { deviceId: micId },
  };

  try {
    mediaStream = await window.navigator.mediaDevices.getUserMedia(
      cameraId || micId
        ? cameraId
          ? preferredCameraConstraits
          : preferredmicConstraits
        : initialConstraits
    );

    console.log(mediaStream);
    displayMedia();
    getAllcamera();
    getAllmics();
  } catch (error) {
    console.log(error);
  }
}

getMedia();

async function getScreenMedia() {
  try {
    mediaStream = await navigator.mediaDevices.getDisplayMedia({
      audio: true,
      video: true,
    });

    displayMedia();
  } catch (error) {
    console.log(error);
  }
}

shareScreen.addEventListener('click', getScreenMedia);

// get display
function displayMedia() {
  video.srcObject = mediaStream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
}

// get all camera
async function getAllcamera() {
  const allDevices = await window.navigator.mediaDevices.enumerateDevices();
  const currentCamera = mediaStream.getVideoTracks()[0];
  selectCam.innerHTML = '';

  allDevices.forEach(device => {
    if (device.kind === 'videoinput') {
      const option = document.createElement('option');
      option.value = device.deviceId;
      option.textContent = device.label;
      option.selected = device.label === currentCamera.label ? true : false;
      selectCam.appendChild(option);
    }
  });
}
// get all mics
async function getAllmics() {
  const allDevices = await window.navigator.mediaDevices.enumerateDevices();
  const currentmic = mediaStream.getAudioTracks()[0];
  selectmic.innerHTML = '';

  allDevices.forEach(device => {
    if (device.kind === 'audioinput') {
      const option = document.createElement('option');
      option.value = device.deviceId;
      option.textContent = device.label;
      option.selected = device.label === currentmic.label ? true : false;
      selectmic.appendChild(option);
    }
  });
}

// selecting specific camera
selectCam.addEventListener('input', e => {
  const cameraId = e.target.value;
  getMedia(cameraId);
});

// selecting specific camera
selectMic.addEventListener('input', e => {
  const micId = e.target.value;
  getMedia(null, micId);
});
