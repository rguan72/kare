import React, { memo, useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import { Text, withStyles, Button, Input } from "@ui-kitten/components";
import { Ionicons } from "@expo/vector-icons";
import { addUser, authNav, AuthState } from "../utils/FirebaseUtils";
import screens from "../constants/screenNames";

function SignupScreen({ navigation }) {
  const [name, setName] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const onIconPress = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const renderIcon = (style) => (
    <TouchableWithoutFeedback onPress={onIconPress}>
      <Ionicons name={secureTextEntry ? "ios-eye-off" : "ios-eye"} />
    </TouchableWithoutFeedback>
  );

  const _onSignUpPressed = async () => {
    addUser(email.value, password.value)
      .then(() => {
        console.log("User account created & signed in!");
        navigation.navigate(screens.setup);
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          console.log("That email address is already in use!");
        }

        if (error.code === "auth/invalid-email") {
          console.log("That email address is invalid!");
        }

        console.error(error);
      });
  };

  return (
    <View style={{ marginTop: 30, backgroundColor: "#F3EAFF", flex: 1 }}>
      {/* <BackButton goBack={() => navigation.navigate('HomeScreen')} /> */}

      {/* <Logo /> */}

      <Text category="h1">Create Account</Text>

      <Input
        placeholder="Email"
        autoCapitalize="none"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: "" })}
        error={!!email.error}
        errorText={email.error}
      />

      <Input
        returnKeyType="done"
        value={password.value}
        placeholder="Password"
        accessoryRight={renderIcon}
        caption="instructions"
        onChangeText={(text) => setPassword({ value: text, error: "" })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry={secureTextEntry}
      />

      <Input
        returnKeyType="done"
        value={password.value}
        placeholder="Retype Password"
        accessoryRight={renderIcon}
        caption="instructions"
        onChangeText={(text) => setPassword({ value: text, error: "" })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry={secureTextEntry}
      />

      <Button
        mode="contained"
        onPress={async () => {
          await _onSignUpPressed();
        }}
        style={styles.button}
      >
        Sign Up
      </Button>

      <View style={styles.row}>
        <Text style={styles.label}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate(screens.login)}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: "black",
  },
  button: {
    marginTop: 24,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  link: {
    fontWeight: "bold",
    color: "mediumpurple",
  },
});

export default withStyles(SignupScreen, (theme) => ({
  light: {
    backgroundColor: theme["color-primary-100"],
  },
}));
