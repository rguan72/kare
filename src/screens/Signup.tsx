import React, { memo, useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import { Modal, Card, Text, withStyles, Button, Input } from "@ui-kitten/components";
import { Ionicons } from "@expo/vector-icons";
import { addUser, authNav, AuthState } from "../utils/FirebaseUtils";
import screens from "../constants/screenNames";
import {emailValid} from "../utils/Parse.ts"
import Logo from '../components/Logo';

function SignupScreen({ navigation }) {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [repassword, setRePassword] = useState({ value: "", error: "" });
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [visible, setVisible] = useState(false);

  const onIconPress = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const renderIcon = (style) => (
    <TouchableWithoutFeedback onPress={onIconPress}>
      <Ionicons name={secureTextEntry ? "ios-eye-off" : "ios-eye"} size={20}/>
    </TouchableWithoutFeedback>
  );

  const onSignUpPressed = async () => {
    console.log("Value")
    console.log(email.value)
    var isEmailValid = emailValid(email.value)
    console.log("Done")
    var doPasswordsMatch = (password.value == repassword.value)
    if (!isEmailValid) {
      console.log("Not umich email")
      email.error = "Sorry, only umich.edu emails can be used right now!";
      setVisible(true);
      return;
    }

    if (!doPasswordsMatch){
      console.log("Passwords don't match")
      email.error = "Both passwords should match";
      setVisible(true);
      return;
    }
    addUser(email.value, password.value)
      .then(() => {
        console.log("User account created & signed in!");
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          console.log("That email address is already in use!");
        }

        if (error.code === "auth/invalid-email") {
          console.log("That email address is invalid!");
        }

        email.error = error.message;
        setVisible(true);
        return;
      });
  };

  return (
    <View style={{ marginTop: 30, backgroundColor: "#F3EAFF", flex: 1 }}>
      {/* <BackButton goBack={() => navigation.navigate('HomeScreen')} /> */}

      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Logo alignItems='center'/> 
      </View> 

      <Input
        placeholder="Email"
        autoCapitalize="none"
        value={email.value}
        onChangeText={(text) => setEmail({value: text, error: ""})}
        error={!!email.error}
        errorText={email.error}
        style={styles.input}
      />

      <Input
        value={password.value}
        placeholder="Password"
        accessoryRight={renderIcon}
        caption=" Make sure your password is at least 6 characters"
        onChangeText={(text) => setPassword({ value: text, error: "" })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry={secureTextEntry}s
        style={styles.input}
      />

      <Input
        returnKeyType="done"
        value={repassword.value}
        placeholder="Retype Password"
        accessoryRight={renderIcon}
        caption=" Make sure both passwords match"
        onChangeText={(text) => setRePassword({ value: text, error: "" })}
        error={!!repassword.error}
        errorText={repassword.error}
        secureTextEntry={secureTextEntry}
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={async () => {
          await onSignUpPressed();
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

      <Modal visible={visible}>
        <Card disabled={true}>
          <Text> {email.error} </Text>
          <Button onPress={() => setVisible(false)} style={styles.button}>CLOSE</Button>
        </Card>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: "black",
  },
  input: {
    marginTop: 10,
    marginLeft: 30,
    marginRight: 30,
  },
  button: {
    marginTop: 24,
    marginLeft: 30,
    marginRight:30,
    borderColor: "#5505BA",
    backgroundColor: "#5505BA",
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
    marginLeft: 30,
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
