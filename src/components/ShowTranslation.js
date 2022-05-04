import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Button,
  ActivityIndicator,
} from "react-native";
import FlipCard from "react-native-flip-card";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { find, isEmpty } from "lodash";

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
  const [vocabSaved, setVocabSaved] = useState(false);
  const data = { english: prediction, suomi: translation };

  useEffect(async () => {
    const storage = await AsyncStorage.getItem("vocabulary");
    if (isEmpty(storage)) {
      setVocabSaved(false);
    } else {
      const vocabulary = JSON.parse(storage);
      const foundVocab = find(vocabulary, data);
      if (isEmpty(foundVocab)) {
        setVocabSaved(false);
      } else {
        setVocabSaved(true);
      }
    }
  }, [data]);

  const handleCancel = () => {
    setShowCamera(true);
    setImage(null);
    setTranslation(null);
    setPrediction(null);
  };

  const handleSave = async () => {
    try {
      const storage = await AsyncStorage.getItem("vocabulary");
      if (isEmpty(storage)) {
        await AsyncStorage.setItem("vocabulary", JSON.stringify([data]));
      } else {
        const vocabulary = JSON.parse(storage);
        const foundVocab = find(vocabulary, data);
        if (isEmpty(foundVocab)) {
          vocabulary.push(data);
          await AsyncStorage.setItem("vocabulary", JSON.stringify(vocabulary));
          setVocabSaved(true);
        } else {
          Alert.alert("This word is already saved");
        }
      }
    } catch (e) {
      console.log("Saving error", e);
    }
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
      {translation && !vocabSaved && (
        <Button title="Save To Vocabulary" onPress={handleSave} />
      )}
      <Button title="Close" onPress={handleCancel} />
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
