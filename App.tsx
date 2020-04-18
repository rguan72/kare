import React, { useState, useEffect } from "react";
import "react-native-gesture-handler";
import { Image } from "react-native";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, Text } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { StyleSheet, YellowBox, View } from "react-native";
import { decode, encode } from "base-64";
import { mapping, light as lightTheme } from "@eva-design/eva";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { LOGO } from "./Images";
import HomeScreen from "./src/screens/Home";
import LoginScreen from "./src/screens/Login";
import SignupScreen from "./src/screens/Signup";
import Thread from "./src/screens/Thread";
import Replies from "./src/screens/Replies";
import SetupSurvey from "./src/screens/Setup";
import VerifyEmailScreen from "./src/screens/Verify";
import Error from "./src/screens/Error";
import screens from "./src/constants/screenNames";
import firebase from "firebase";
import AppStyles from "./src/StyleSheets/AppStyles";

import UserComments from "./src/screens/UserComments";

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
        <Stack.Navigator initialRouteName={screens.signup}>
          <Stack.Screen
            name={screens.home}
            component={HomeScreen}
            options={{ title: "", headerTransparent: true }}
          />
          <Stack.Screen
            name={screens.setup}
            component={SetupSurvey}
            options={{ title: "", headerTransparent: true }}
          />
          <Stack.Screen
            name={screens.signup}
            component={SignupScreen}
            options={{ title: "", headerTransparent: true }}
          />
          <Stack.Screen
            name={screens.login}
            component={LoginScreen}
            options={{ title: "", headerTransparent: true }}
          />
          <Stack.Screen
            name={screens.verifyEmail}
            component={VerifyEmailScreen}
            options={{ title: "", headerTransparent: true }}
          />
          <Stack.Screen
            name={screens.userComments}
            component={UserComments}
            options={{
              headerTitle: "",
              headerTransparent: true,
            }}
          />
          <Stack.Screen
            name={screens.thread}
            component={Thread}
            options={{
              headerTitle: "",
              headerTransparent: true,
            }}
          />
          <Stack.Screen
            name={screens.replies}
            component={Replies}
            options={{
              headerTitle: "",
              headerTransparent: true,
            }}
          />
          <Stack.Screen
            name={screens.error}
            component={Error}
            options={{
              headerTitle: "",
              headerTransparent: true,
            }}
          />
        </Stack.Navigator>
      </ApplicationProvider>
    </NavigationContainer>
  );
}
