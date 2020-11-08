function setupFaceDetectionAndRecognition(){
    console.log('Loading face detection and recognition models...');
    return Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('ai-utils/face-recognition-models'),
        faceapi.nets.faceLandmark68TinyNet.loadFromUri('ai-utils/face-recognition-models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('ai-utils/face-recognition-models')
    ]);
}

function displayDetections(detections){
    // resize the bounding boxes of the detected faces
    // accordingly to the size of the canvas
    let resizedDetections = faceapi.resizeResults(detections, __webcam.canvasDisplaySize);
    
    // cleaning the canvas from previous bounding boxes
    __webcam.faceDetectorCanvas.getContext('2d').clearRect(
        0,
        0,
        __webcam.faceDetectorCanvas.width,
        __webcam.faceDetectorCanvas.height
    );
    
    // draw the new bounding boxes
    faceapi.draw.drawDetections(__webcam.faceDetectorCanvas, resizedDetections);
}

// function to detect the faces
function detectFace(){
    // storing the current timestamp
    // at the beginning of the detection
    let startTimestamp = Date.now();

    // use tiny models
    let options = new faceapi.TinyFaceDetectorOptions();

    // detect the faces with faceapi
    // !! this call is a Promise !!
    // this means that it does not return
    // the detections, but a Promise object that
    // can be then used to check when the
    // detection algorithm has completed
    // and get the detected faces
    faceapi.detectAllFaces(
        __webcam.webcamElement,
        options
    ).withFaceLandmarks(
        new faceapi.TinyFaceDetectorOptions()
    ).withFaceDescriptors(
        new faceapi.TinyFaceDetectorOptions()
    ).then(
        // this is invoke once the Promise
        // created by detectAllFaces
        // terminate with success
        function (detections){
            // we save the timestamp now
            // after the end of the detection
            let endTimestamp = Date.now();

            // we compute the time difference in seconds
            let timeElapsed = (endTimestamp - startTimestamp)/1000;
            
            // finally we publish a message
            // for the topic 'face_detection_complete'
            // and pass the detections as the message
            manager.publish(
                'face_detection_result',
                {
                    detections: detections,
                    startTime: startTimestamp,
                    endTime: endTimestamp,
                    elapsedTime: timeElapsed
                }
            );
        }
    ).catch(
        // this is executed only if the
        // Promise created by detectAllFaces
        // has some error
        function (err){
            console.error(`Error during face detection: ${err}`);
        }
    )
}




