import React, { useState, useEffect, useReducer, useMemo } from "react";
import "react-native-gesture-handler";
import { Image } from "react-native";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, Text } from "@ui-kitten/components";
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
import ManageGroups from "./src/screens/ManageGroups";
import Error from "./src/screens/Error";
import UserAgreement from "./src/screens/UserAgreement";
import PasswordReset from "./src/screens/PasswordReset";
import screens from "./src/constants/screenNames";
import firebase from "firebase/app";
import { default as theme } from "./theme.json";

import UserComments from "./src/screens/UserComments";
import { setDebugModeEnabled } from "expo-firebase-analytics";

// Global State
import { KareContext } from "./src/KareContext";
import { useCombinedReducer } from "./src/reducers/useCombineReducers";
import { userReducer } from "./src/reducers/userReducers";
import { groupReducer } from "./src/reducers/groupReducers";
import { connectorReducer } from "./src/reducers/connectorReducers";

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
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState({});

  // Global State
  const [state, dispatch] = useCombinedReducer({
    user: useReducer(userReducer, {}),
    groups: useReducer(groupReducer, { userGroups: [], allGroups: [] }),
    connectors: useReducer(connectorReducer, {}),
  }); // intial user and groups are empty

  // so value is only reinitialized if userState or dispatch change
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  // Handle user state changes
  function onAuthStateChanged(user) {
    console.log("onAuthStateChanged");
    setUser(user);
    console.log("user: " + user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (__DEV__) setDebugModeEnabled(true);

  if (initializing) return null;
  return (
    <NavigationContainer>
      <ApplicationProvider
        mapping={mapping}
        theme={{ ...lightTheme, ...theme }}
      >
        <KareContext.Provider value={value}>
          <Stack.Navigator>
            {!user ? (
              <>
                <Stack.Screen
                  name={screens.signup}
                  component={SignupScreen}
                  options={{ title: "", headerTransparent: true }}
                />
                <Stack.Screen
                  name={screens.userAgreement}
                  component={UserAgreement}
                  options={{ title: "", headerTransparent: true }}
                />
                <Stack.Screen
                  name={screens.login}
                  component={LoginScreen}
                  options={{ title: "", headerTransparent: true }}
                />
                <Stack.Screen
                  name={screens.passwordReset}
                  component={PasswordReset}
                  options={{ title: "", headerTransparent: true }}
                />
                <Stack.Screen
                  name={screens.setup}
                  component={SetupSurvey}
                  options={{ title: "", headerTransparent: true }}
                />
                <Stack.Screen
                  name={screens.error}
                  component={Error}
                  options={{
                    headerTitle: "",
                    headerTransparent: true,
                  }}
                />
              </>
            ) : user.emailVerified ? (
              <>
                <Stack.Screen
                  name={screens.home}
                  component={HomeScreen}
                  options={{ title: "", headerTransparent: true }}
                  initialParams={{ userId: user.uid }}
                />
                <Stack.Screen
                  name={screens.manage}
                  component={ManageGroups}
                  options={{ title: "", headerTransparent: true }}
                  initialParams={{ userId: user.uid }}
                />
                <Stack.Screen
                  name={screens.userComments}
                  component={UserComments}
                  options={{
                    headerTitle: "",
                    headerTransparent: true,
                  }}
                  initialParams={{ userId: user.uid }}
                />
                <Stack.Screen
                  name={screens.thread}
                  component={Thread}
                  options={{
                    headerTitle: "",
                    headerTransparent: true,
                  }}
                  initialParams={{ userId: user.uid }}
                />
                <Stack.Screen
                  name={screens.replies}
                  component={Replies}
                  options={{
                    headerTitle: "",
                    headerTransparent: true,
                  }}
                  initialParams={{ userId: user.uid }}
                />
                <Stack.Screen
                  name={screens.error}
                  component={Error}
                  options={{
                    headerTitle: "",
                    headerTransparent: true,
                  }}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name={screens.verifyEmail}
                  component={VerifyEmailScreen}
                  options={{ title: "", headerTransparent: true }}
                />
                <Stack.Screen
                  name={screens.error}
                  component={Error}
                  options={{
                    headerTitle: "",
                    headerTransparent: true,
                  }}
                />
              </>
            )}
          </Stack.Navigator>
        </KareContext.Provider>
      </ApplicationProvider>
    </NavigationContainer>
  );
}
