import React, { memo, useState, useEffect } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import {
  Modal,
  Card,
  Text,
  withStyles,
  Button,
  Input,
} from "@ui-kitten/components";
import { Ionicons } from "@expo/vector-icons";
import { authNav, AuthState } from "../utils/FirebaseUtils";
import screens from "../constants/screenNames";
import { emailValid } from "../utils/Parse.ts";
import Logo from "../components/Logo";
import firebase from "firebase";

function SignupScreen({ navigation }) {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [repassword, setRePassword] = useState({ value: "", error: "" });
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [visible, setVisible] = useState(false);
  const [passCaption, setPassCaption] = useState("");
  const [pass2Caption, setPass2Caption] = useState("");
  const [isUpper, setIsUpper] = useState(false);
  const [isLower, setIsLower] = useState(false);
  const [isDigit, setIsDigit] = useState(false);
  const [isSpecial, setIsSpecial] = useState(false);
  const [isInv, setIsInv] = useState(false);
  const [isLong, setIsLong] = useState(false);

  const specialChars = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":\?]/); // acceptable special characters?
  const unacceptable = new RegExp(/[<>]/);

  const newCaption = () => {
    var caption = "";
    if (!isLong)
      caption = caption + "Password must be greater than 8 characters long. \n";
    if (!isUpper) caption = caption + "Password needs an upper case letter. \n";
    if (!isLower) caption = caption + "Password needs a lower case letter. \n";
    if (!isDigit) caption = caption + "Password needs a number. \n";
    if (!isSpecial) caption = caption + "Password needs a special character. \n";
    if (isInv) caption = caption + "Password uses invalid characters (< or >)";
    return caption;
  };

  useEffect(() => {
    var new_cap = newCaption();
    setPassCaption(new_cap);
  });

  const onIconPress = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const renderIcon = (style) => (
    <TouchableWithoutFeedback onPress={onIconPress}>
      <Ionicons name={secureTextEntry ? "ios-eye-off" : "ios-eye"} size={20} />
    </TouchableWithoutFeedback>
  );

  const onSignUpPressed = async () => {
    var isEmailValid = emailValid(email.value);
    var doPasswordsMatch = password.value == repassword.value;
    if (!isEmailValid) {
      console.log("Not umich email");
      email.error = "Sorry, only umich.edu emails can be used right now!";
      setVisible(true);
      return;
    }

    if (!doPasswordsMatch) {
      console.log("Passwords don't match");
      email.error = "Both passwords should match";
      setVisible(true);
      return;
    }
    if (!(isLower && isSpecial && isUpper && isLong && isDigit)) {
      console.log(isLower && isSpecial && isUpper && isLong && isDigit);
      console.log("Password Issue");
      email.error = newCaption();
      setVisible(true);
      return;
    }
    var methods = await firebase.auth().fetchSignInMethodsForEmail(email.value);
    if (methods.length != 0) {
      console.log("email already used");
      email.error = "This email address is already associated with an account.";
      setVisible(true);
      return;
    } else {
      console.log("Moving to set up");
      navigation.navigate(screens.userAgreement, {
        email: email.value,
        password: password.value,
      });
    }
  };

  const onPasswordChange = (text) => {
    setPassword({ value: text, error: "" });
    var upper = false;
    var lower = false;
    var digit = false;
    text.length >= 8 ? (setIsLong(true)) : (setIsLong(false));
    specialChars.test(text) ? (setIsSpecial(true)) : (setIsSpecial(false));
    unacceptable.test(text) ? (setIsInv(true)) : (setIsInv(false));
    for (var i = 0; i < text.length; i++) {
      if (text[i] == text[i].toUpperCase() && text[i] != text[i].toLowerCase())
        upper = true;
      if (text[i] == text[i].toLowerCase() && text[i] != text[i].toUpperCase())
        lower = true;
      if (text[i] >= "0" && text[i] <= "9") digit = true;
    }
    setIsUpper(upper);
    setIsLower(lower);
    setIsDigit(digit);
    var new_cap = newCaption();
    setPassCaption(new_cap);
  };

  return (
    <View style={{ marginTop: 30, backgroundColor: "#F3EAFF", flex: 1 }}>
      {/* <BackButton goBack={() => navigation.navigate('HomeScreen')} /> */}

      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Logo />
      </View>

      <Input
        placeholder='Email'
        autoCapitalize='none'
        autoCompleteType='email'
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: "" })}
        error={!!email.error}
        errorText={email.error}
        style={styles.input}
      />

      <Input
        value={password.value}
        placeholder='Password'
        autoCapitalize='none'
        autoCompleteType='password'
        accessoryRight={renderIcon}
        caption={passCaption}
        onChangeText={onPasswordChange}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry={secureTextEntry}
        style={styles.input}
      />
      <Input
        returnKeyType='done'
        value={repassword.value}
        autoCapitalize='none'
        autoCompleteType='password'
        placeholder='Retype Password'
        accessoryRight={renderIcon}
        caption={pass2Caption}
        onChangeText={(text) => {
          //setPass2Caption("");
          if (password.value == text) {
            setPass2Caption("");
          } else {
            setPass2Caption("Make sure Passwords match");
          }
          setRePassword({ value: text, error: "" });
        }}
        error={!!repassword.error}
        errorText={repassword.error}
        secureTextEntry={secureTextEntry}
        style={styles.input}
      />

      <Button
        mode='contained'
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
          <Button onPress={() => setVisible(false)} style={styles.button}>
            CLOSE
          </Button>
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
    marginRight: 30,
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
