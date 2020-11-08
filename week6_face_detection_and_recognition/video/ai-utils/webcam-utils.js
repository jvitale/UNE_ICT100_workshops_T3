// global variable with webcam properties
const __webcam = {
    webcamElement: null,
    isWebcamOpen: false,
    faceDetectorCanvas: null,
    canvasDisplaySize: null,
    webcamConstraints: {
        audio: false,
        video: {width: 320, height:240}
    }
}

function onWebcamOpen(){
    // we create a canvas as overlay of the video element
    __webcam.faceDetectorCanvas = faceapi.createCanvasFromMedia(__webcam.webcamElement);
    let videoFrame = document.getElementById('video-frame');
    videoFrame.append(__webcam.faceDetectorCanvas);

    // we set some properties to make sure that
    // the canvas and the video elements
    // are perfectly overlapping
    __webcam.faceDetectorCanvas.style.position = 'absolute';
    __webcam.faceDetectorCanvas.style.top = 0;
    __webcam.faceDetectorCanvas.style.left = 0;

    __webcam.canvasDisplaySize = {
        width: __webcam.webcamElement.width,
        height: __webcam.webcamElement.height
    };
    faceapi.matchDimensions(__webcam.faceDetectorCanvas, __webcam.canvasDisplaySize);
    manager.publish('webcam_ready', {});
}

// function to open webcam and show it on the webpage
async function openWebcam(constraints){
    var stream = null;
    try {
        let webcamElement = document.getElementById('webcam-feed');
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        webcamElement.srcObject = stream;
        __webcam.webcamElement = webcamElement;
        __webcam.isWebcamOpen = true;
        console.log('Webcam feed is now open');
        __webcam.webcamElement.addEventListener(
            'play',
            onWebcamOpen
        );
    } catch(err) {
        console.error('Error during opening webcam: ' + err);
    }
}
