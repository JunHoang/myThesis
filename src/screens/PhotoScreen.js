import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import "@tensorflow/tfjs-react-native";
import * as jpeg from "jpeg-js";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import translate from "translate";
import { withNavigationFocus } from "react-navigation";

import ShowTranslation from "../components/ShowTranslation";
import ShowCamera from "../components/ShowCamera";

const PhotoScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const focusedCamera = useIsFocused();
  const [showCamera, setShowCamera] = useState(focusedCamera);
  const cameraRef = useRef(null);
  const [image, setImage] = useState(null);
  const [isTfReady, setIsTfReady] = useState(false);
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [translation, setTranslation] = useState(null);

  //Load MobileNetModel
  const loadMobileNetModel = async () => {
    const model = await mobilenet.load();
    return model;
  };

  useEffect(() => {
    if (!isTfReady) {
      (async () => {
        await tf.ready();
        // Fixed crashing app on android 12
        tf.env().set("WEBGL_PACK_DEPTHWISECONV", false);
        setModel(await loadMobileNetModel());
        setIsTfReady(true);
      })();
    }
  }, []);

  const requestCamera = async () => {
    try {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      setHasPermission(cameraPermission.status === "granted");
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    requestCamera();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const takePhoto = async () => {
    if (cameraRef) {
      try {
        let photo = await cameraRef.current.takePictureAsync({
          allowsEditing: true,
          quality: 0.5,
        });
        return photo;
      } catch (e) {
        console.log(e);
      }
    }
  };

  const imageToTensor = (rawImageData) => {
    const TO_UINT8ARRAY = true;
    const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY);

    const buffer = new Uint8Array(width * height * 3);
    let offset = 0; // offset into original data
    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset];
      buffer[i + 1] = data[offset + 1];
      buffer[i + 2] = data[offset + 2];

      offset += 4;
    }

    return tf.tensor3d(buffer, [height, width, 3]);
  };

  const detectObjects = async (imgB64) => {
    try {
      const imgBuffer = tf.util.encodeString(imgB64, "base64").buffer;
      const raw = new Uint8Array(imgBuffer);
      const imageTensor = imageToTensor(raw);
      const predictions = await model.classify(imageTensor, 1);
      if (predictions) {
        const translation = await translate(predictions[0].className, {
          to: "fi",
        });
        setPrediction(predictions[0].className);
        setTranslation(translation);
      }
    } catch (error) {
      console.log("Exception Error: ", error);
    }
  };

  const pickImage = async () => {
    setShowCamera(false);
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      presentationStyle: 0,
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.5,
    });

    if (!result.cancelled) {
      const manipResult = await manipulateAsync(
        result.uri,
        [
          {
            resize: {
              width: Dimensions.get("window").width * 0.6,
              height: Dimensions.get("window").height * 0.5,
            },
          },
        ],
        { compress: 1, format: SaveFormat.JPEG, base64: true }
      );
      setImage(manipResult.uri);
      detectObjects(manipResult.base64);
    } else {
      setShowCamera(true);
    }
  };

  const cropImage = async (response) => {
    const manipResult = await manipulateAsync(
      response.uri,
      [
        {
          crop: {
            height: response.height * 0.6,
            originX: response.width * 0.2,
            originY: response.height * 0.15,
            width: response.width * 0.6,
          },
        },
        {
          resize: {
            width: Dimensions.get("window").width * 0.6,
            height: Dimensions.get("window").height * 0.5,
          },
        },
      ],
      { compress: 1, base64: true, format: SaveFormat.JPEG }
    );
    return manipResult;
  };

  const handleClick = async () => {
    const response = await takePhoto();
    const image = await cropImage(response);
    setImage(image.uri);
    setShowCamera(false);
    detectObjects(image.base64);
  };

  return (
    <View style={styles.container}>
      {showCamera ? (
        <ShowCamera
          handleClick={handleClick}
          cameraRef={cameraRef}
          type={Camera.Constants.Type.back}
          pickImage={pickImage}
        />
      ) : (
        image && (
          <ShowTranslation
            image={image}
            translation={translation}
            prediction={prediction}
            setTranslation={setTranslation}
            setPrediction={setPrediction}
            setShowCamera={setShowCamera}
            setImage={setImage}
          />
        )
      )}
    </View>
  );
};

export default withNavigationFocus(PhotoScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
