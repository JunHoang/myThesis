import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { isEmpty, remove } from "lodash";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";

const VocabularyScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [dataStorage, setDataStorage] = useState([]);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(async () => {
    const data = await AsyncStorage.getItem("vocabulary");
    if (data) {
      const storage = JSON.parse(data);
      setDataStorage(storage);
    }
    setIsChanging(false);
  }, [isFocused, isChanging]);

  let colors = ["#FFEDDB", "#EDCDBB", "#E3B7A0", "#BF9270"];

  const showVocabularyList = dataStorage?.map((item, index) => {
    let rowStyle = [
      styles.row,
      { backgroundColor: colors[index % colors.length] },
    ];

    const handleDelete = async () => {
      remove(dataStorage, (removeItem) => {
        return removeItem.english === item.english;
      });
      await AsyncStorage.setItem("vocabulary", JSON.stringify(dataStorage));
      setIsChanging(true);
    };

    return (
      <View key={item.english} style={rowStyle}>
        <View style={styles.text}>
          <Text key={item.suomi} style={styles.textFinnish}>
            {item.suomi}
          </Text>
          <Text key={item.english} style={styles.textEnglish}>
            {item.english}
          </Text>
        </View>
        <View style={styles.icon}>
          <TouchableOpacity onPress={handleDelete}>
            <MaterialIcons name="delete-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    );
  });

  if (isEmpty(dataStorage)) {
    return (
      <View>
        <Button
          title="Go to translate"
          onPress={() => {
            navigation.navigate("Translate");
          }}
        />
      </View>
    );
  }

  return <ScrollView>{showVocabularyList}</ScrollView>;
};

export default VocabularyScreen;

const styles = StyleSheet.create({
  row: {
    padding: 10,
    flexDirection: "row",
  },
  text: {
    width: "90%",
    marginRight: 10,
  },
  textFinnish: {
    fontSize: 18,
    textTransform: "capitalize",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  textEnglish: {
    textAlign: "right",
    textTransform: "capitalize",
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
  },
});
