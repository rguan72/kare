import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  View,
} from "react-native";
import screens from "../constants/screenNames";
import firebase from "firebase";
import * as Analytics from "expo-firebase-analytics";
import {
  Modal,
  Card,
  Text,
  withStyles,
  Button,
  Input,
} from "@ui-kitten/components";
import { Ionicons } from "@expo/vector-icons";
import Logo from "../components/Logo";

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    Analytics.setCurrentScreen("Login");
  }, []);

  const onIconPress = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const renderIcon = (style) => (
    <TouchableWithoutFeedback onPress={onIconPress}>
      <Ionicons name={secureTextEntry ? "ios-eye-off" : "ios-eye"} size={20} />
    </TouchableWithoutFeedback>
  );

  const _onLoginPressed = () => {
    console.log(email.value);
    firebase
      .auth()
      .signInWithEmailAndPassword(email.value, password.value)
      .then(() => {
        Analytics.logEvent("Login", {
          name: "login",
          screen: "Login",
          purpose: "Login to Kare account",
        });
      })
      .catch(function (error) {
        console.log("Login Error");
        var errorCode = error.code;
        email.error = error.message;
        setVisible(true);
        return;
      });
  };

  return (
    <View style={{ paddingTop: 30, backgroundColor: "#F3EAFF", flex: 1 }}>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Logo alignItems="center" />
      </View>

      <View style={styles.container}>
        <Input
          placeholder="Please enter your email"
          returnKeyType="next"
          value={email.value}
          onChangeText={(text) => setEmail({ value: text, error: "" })}
          error={!!email.error}
          errorText={email.error}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
          style={styles.input}
        />
      </View>

      <View style={styles.container}>
        <Input
          returnKeyType="done"
          value={password.value}
          placeholder="Please enter your password"
          accessoryRight={renderIcon}
          onChangeText={(text) => setPassword({ value: text, error: "" })}
          error={!!password.error}
          errorText={password.error}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          autoCompleteType="password"
          style={styles.input}
        />
      </View>

      <Button mode="contained" onPress={_onLoginPressed} style={styles.button}>
        Login
      </Button>

      <View style={styles.row}>
        <Text style={styles.label}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate(screens.signup)}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={visible}>
        <Card disabled={true}>
          <Text> {email.error} </Text>
          <Button onPress={() => setVisible(false)} style={styles.button}>
            CLOSE
          </Button>
        </Card>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  /*forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },*/
  container: {
    width: "100%",
    marginVertical: 12,
  },
  button: {
    marginTop: 24,
    marginLeft: 30,
    marginRight: 30,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
    marginLeft: 10,
  },
  label: {
    color: "black",
    marginLeft: 20,
  },
  input: {
    marginTop: 10,
    marginLeft: 30,
    marginRight: 30,
  },
  link: {
    fontWeight: "bold",
    color: "mediumpurple",
  },
});

export default withStyles(LoginScreen, (theme) => ({
  light: {
    backgroundColor: theme["color-primary-100"],
  },
}));
