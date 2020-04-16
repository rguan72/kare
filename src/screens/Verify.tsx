import React from "react";
import firebase from "firebase/app";
import { View, TouchableOpacity } from "react-native";
import { Text, Button } from "@ui-kitten/components";
import { sendVerificationEmail, getCurrentUser } from "../utils/FirebaseUtils";
import colors from "../constants/userColors";

export default function VerifyEmail({ navigation }) {
  const user = getCurrentUser();
  let email;

  // TODO: issue #7
  if (!user) {
    // TODO: navigate to sign in/sign up page
    console.log("not signed in");
    firebase.auth().signInWithEmailAndPassword("guanr@umich.edu", "password");
    email = "hi";
  } else {
    email = user.email;
  }

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
