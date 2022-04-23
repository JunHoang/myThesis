import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Camera } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";

const ShowCamera = ({ handleClick, cameraRef, type, pickImage }) => {
  return (
    <Camera style={styles.camera} type={type} ref={cameraRef}>
      <View style={styles.overlayFocus} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.text}>
            <Ionicons name="images-outline" size={34} color="white" />
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleClick}>
          <View
            style={{
              borderWidth: 2,
              borderRadius: 50,
              borderColor: "white",
              height: 50,
              width: 50,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 5,
            }}
          >
            <View
              style={{
                borderWidth: 2,
                borderRadius: 50,
                borderColor: "white",
                height: 40,
                width: 40,
                backgroundColor: "white",
              }}
            ></View>
          </View>
        </TouchableOpacity>
        <View style={styles.button} />
      </View>
    </Camera>
  );
};

export default ShowCamera;

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  overlayFocus: {
    borderColor: "white",
    borderWidth: 2,
    height: Dimensions.get("window").height * 0.5,
    width: Dimensions.get("window").width * 0.6,
    marginTop: Dimensions.get("window").height * 0.13,
    alignSelf: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20,
    paddingBottom: 5,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
});
