import React, { memo, useState } from "react";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  View,
  Image,
} from "react-native";
import { CommonActions } from "@react-navigation/native";
import { authNav, AuthState, sendPasswordResetEmail } from "../utils/FirebaseUtils";
import screens from "../constants/screenNames";
import firebase from "firebase";
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
import PasswordResetStyles from "../StyleSheets/PasswordResetStyles"

function PasswordReset({ navigation }) {
const [email, setEmail] = useState({ value: "", error: "" });

const onSendPasswordReset = () => {
	let errorCode = sendPasswordResetEmail(email.value);
	if (!(errorCode == "Email was sent.")) {
		email.error = errorCode;
		setVisible(true);
	}
}

  const [visible, setVisible] = useState(false);

  return (
    <View style={{ marginTop: "5%", backgroundColor: "#F3EAFF", flex: 1 }}>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Logo/>
      </View>

      <View style={PasswordResetStyles.container}>
        <Input
          placeholder="Please enter your email"
          returnKeyType="next"
          value={email.value}
          onChangeText={(text) => setEmail({ value: text, error: "" })}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
          style={PasswordResetStyles.input}
        />
      </View>

      <Button onPress={onSendPasswordReset} style={PasswordResetStyles.button}>
        Email a Link to Reset Your Password
      </Button>

      <Modal visible={visible}>
        <Card disabled={true}>
          <Text> {email.error} </Text>
          <Button onPress={() => setVisible(false)} style={PasswordResetStyles.button}>
            CLOSE
          </Button>
        </Card>
      </Modal>
    </View>
  );
}

export default withStyles(PasswordReset, (theme) => ({
	light: {
	backgroundColor: theme["color-primary-100"],
	},
  }));

