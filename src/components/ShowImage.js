import { StyleSheet, View, ImageBackground, Dimensions } from "react-native";
import React from "react";

const ShowImage = ({ image }) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: image }}
        style={styles.image}
      ></ImageBackground>
    </View>
  );
};

export default ShowImage;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: 400,
  },
  image: {
    alignItems: "center",
    justifyContent: "center",
    height: Dimensions.get("window").height * 0.5,
    width: Dimensions.get("window").width * 0.6,
  },
});
