import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import PhotoScreen from "./src/screens/PhotoScreen";
import VocabularyScreen from "./src/screens/VocabularyScreen";
import translate from "translate";

translate.engine = "google";
translate.key = process.env.GOOGLE_KEY;
translate.from = "en";

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Vocabulary"
        screenOptions={{
          tabBarActiveTintColor: "#ff6f00",
        }}
      >
        <Tab.Screen
          name="Vocabulary"
          options={{
            tabBarLabel: "Vocabulary",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="list-alt" size={size} color={color} />
            ),
          }}
          component={VocabularyScreen}
        />
        <Tab.Screen
          name="Translate"
          options={{
            tabBarLabel: "Translation",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="translate" size={size} color={color} />
            ),
          }}
          component={PhotoScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
