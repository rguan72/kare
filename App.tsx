import React, {useState, useEffect}from "react";
import "react-native-gesture-handler";
import { Image } from "react-native";
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Text } from "@ui-kitten/components";
import { EvaIconsPack } from '@ui-kitten/eva-icons';
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
import SetupSurvey from './src/screens/Setup';
import firebase from 'firebase';

// Firebase bug workaround: https://stackoverflow.com/questions/60361519/cant-find-a-variable-atob
if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

const Stack = createStackNavigator();

function LogoTitle() {
  return <Image style={{ width: 60, height: 60 }} source={LOGO} />;
}

export default function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  // Ignore Firebase timer issues
  YellowBox.ignoreWarnings(["Setting a timer"]);
  console.ignoredYellowBox = ["Setting a timer"];

  if (user){
    return (
      <NavigationContainer>
        <ApplicationProvider mapping={mapping} theme={lightTheme}>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: "", headerTransparent: true }}
            />
            <Stack.Screen
              name="Thread"
              component={Thread}
              options={{
                headerTitle: "",
                headerTransparent: true
              }}
            />
          </Stack.Navigator>
        </ApplicationProvider>
      </NavigationContainer>
    ) 
  }
  return (
    <NavigationContainer>
      <ApplicationProvider mapping={mapping} theme={lightTheme}>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{title:"", headerTransparent: true}}
          />
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{title:"", headerTransparent: true}}
          />
          <Stack.Screen
            name="SetupSurvey"
            component={SetupSurvey}
            options={{title: "", headerTransparent: true}}
          />
        </Stack.Navigator>
      </ApplicationProvider>
    </NavigationContainer>
  )
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
