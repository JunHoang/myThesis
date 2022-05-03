import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
} from "react-native";
import FlipCard from "react-native-flip-card";

import ShowImage from "./ShowImage";

const ShowTranslation = ({
  image,
  translation,
  prediction,
  setTranslation,
  setPrediction,
  setShowCamera,
  setImage,
}) => {
  const handleCancel = () => {
    setShowCamera(true);
    setImage(null);
    setTranslation(null);
    setPrediction(null);
  };

  return (
    <View style={styles.container}>
      <ShowImage image={image} />
      {translation ? (
        <FlipCard style={styles.cardContainer}>
          {/* Face Side */}
          <View style={styles.card}>
            <Text style={styles.textTitle}>Suomi: </Text>
            <Text style={styles.text}>{translation}</Text>
          </View>
          {/* Back Side */}
          <View style={styles.card}>
            <Text style={styles.textTitle}>English: </Text>
            <Text style={styles.text}>{prediction}</Text>
          </View>
        </FlipCard>
      ) : (
        <View style={styles.card}>
          <ActivityIndicator size="large" color="black" />
          <Text style={styles.loading}>Loading</Text>
        </View>
      )}
      <Button title="Close" onPress={handleCancel} style={styles.container} />
    </View>
  );
};

export default ShowTranslation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    margin: 10,
    borderColor: "black",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    flex: 1,
    justifyContent: "center",
  },
  textTitle: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  loading: {
    fontSize: 18,
    textAlign: "center",
  },
});
