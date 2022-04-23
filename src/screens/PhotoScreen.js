import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

import ShowImage from "../components/ShowImage";
import ShowCamera from "../components/ShowCamera";

const PhotoScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const focusedCamera = useIsFocused();
  const [showCamera, setShowCamera] = useState(focusedCamera);
  const cameraRef = useRef(null);

  const [image, setImage] = useState(null);

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
      ],
      { compress: 1, format: SaveFormat.JPEG }
    );
    return manipResult;
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
            resize: { width: result.width * 0.7, height: result.height * 0.7 },
          },
        ],
        { compress: 0.7, format: SaveFormat.JPEG }
      );

      setImage(manipResult.uri);
      setShowCamera(false);
    } else {
      setShowCamera(true);
    }
  };

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

  const handleClick = async () => {
    const response = await takePhoto();
    const image = await cropImage(response);
    setImage(image.uri);
    setShowCamera(false);
  };

  const handleCancel = () => {
    setShowCamera(true);
    setImage(null);
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

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
        image && <ShowImage image={image} handleCancel={handleCancel} />
      )}
    </View>
  );
};

export default PhotoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
