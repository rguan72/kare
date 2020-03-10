import React from "react";
import "react-native-gesture-handler";
import { ApplicationProvider, Text } from "@ui-kitten/components";
import { StyleSheet, YellowBox } from "react-native";
import { decode, encode } from "base-64";
import { mapping, light as lightTheme } from "@eva-design/eva";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./src/screens/Home";
import Thread from "./src/screens/Thread";

// Firebase bug workaround: https://stackoverflow.com/questions/60361519/cant-find-a-variable-atob
if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

const Stack = createStackNavigator();

export default function App() {
  // Ignore Firebase timer issues
  YellowBox.ignoreWarnings(["Setting a timer"]);
  console.ignoredYellowBox = ["Setting a timer"];
  return (
    <NavigationContainer>
      <ApplicationProvider mapping={mapping} theme={lightTheme}>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Groups" }}
          />
          <Stack.Screen
            name="Thread"
            component={Thread}
            options={{ title: "HelpNow" }}
          />
        </Stack.Navigator>
      </ApplicationProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  m: {
    margin: 20
  }
});
