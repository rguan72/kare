import React from "react";
import firebase from "firebase/app";
import { View, TouchableOpacity } from "react-native";
import { Text, Button } from "@ui-kitten/components";
import {
  sendVerificationEmail,
  getCurrentUser,
  authNav,
  AuthState,
} from "../utils/FirebaseUtils";
import colors from "../constants/userColors";

export default function VerifyEmail({ navigation }) {
  let email;

  authNav(navigation, AuthState.emailverify);

  return (
    <View
      style={{
        display: "flex",
        flexGrow: 1,
        flexShrink: 0,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors["purple"],
      }}
    >
      <Text style={{ textAlign: "center" }} category="h6">
        A verification email was just sent to: {email}
      </Text>
      <TouchableOpacity
        style={{
          marginTop: 10,
        }}
        disabled
      >
        <Button
          onPress={() => {
            console.log("sent email");
            sendVerificationEmail();
          }}
        >
          Resend Link
        </Button>
      </TouchableOpacity>
    </View>
  );
}
