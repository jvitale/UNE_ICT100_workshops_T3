var __faceDescriptors = {
    'pico': [],
    'bit': []
}

async function retrieveFace(maxAttempts){
    let detections = [];
    let attempts = 0;
    let tempSubFaceDet;
    let promiseLearning = new Promise(
        (resolve) => {
            tempSubFaceDet = manager.subscribe(
                'face_detection_result',
                (msg) => {
                    if (msg.detections.length > 0){
                        detections = msg.detections;
                        resolve(true);
                    } else {
                        attempts++;
                    }
                    if (attempts >= 3){
                        resolve(false);
                    }
                }
            );
        }
    );

    await promiseLearning;
    manager.unsubscribe(tempSubFaceDet);
    return detections;
}

// function to extract the face features
// and store them with the user name
async function learnFace(userName, botName){
    // attempting to detect a face three times
    let detections = await retrieveFace(3);
    
    if (detections.length > 0){
        let userFaceDescriptors = new faceapi.LabeledFaceDescriptors(
            userName, 
            [detections[0].descriptor]
        );
        // storing the descriptors for the current bot
        __faceDescriptors[botName].push(userFaceDescriptors);
        return true;
    } else {
        return false;
    }
}

// function to match the face and recognise
// the identity
async function recogniseFace(botName){
    if (__faceDescriptors[botName].length == 0){
        // no faces stored
        // end and return false
        return false;
    }

    // attempting to detect a face three times
    let detections = await retrieveFace(3);
    
    if (detections.length > 0){
        let faceMatcher = new faceapi.FaceMatcher(__faceDescriptors[botName], 0.6);
        let match = faceMatcher.findBestMatch(detections[0].descriptor);

        if (match.label != 'unknown'){
            return match.label;
        } else {
            return false;
        }
    } else {
        return false;
    }
}