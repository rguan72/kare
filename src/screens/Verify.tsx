import React, {useState} from "react";
import firebase from "firebase/app";
import { View, TouchableOpacity } from "react-native";
import { Modal, Card, Text, Button } from "@ui-kitten/components";
import {
  sendVerificationEmail,
  getCurrentUser,
  authNav,
  AuthState,
} from "../utils/FirebaseUtils";
import colors from "../constants/userColors";
import {setUser} from "../App.tsx"

export default function VerifyEmail({ navigation }) {
  let email;
  const user = getCurrentUser();
  const [visible, setVisible] = useState(false);
  const [buttonTxt, setButtonTxt] = useState("Send Verification")
  const onSignOut = () => {
    setVisible(true);
    firebase
      .auth()
      .signOut()
      .catch(function (error) {
        console.log(error.message);
      });
  };

  if (user) email = user.email;
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
      <Modal visible={visible}>
        <Card disabled={true}>
          <Text> Once you've clicked the link in the verification email, you're ready to login. </Text>
          <Button onPress={() => onSignOut()} style={{marginTop: 5, backgroundColor: "#5505BA"}}>CLOSE</Button>
        </Card>
      </Modal>
      <Text style={{ textAlign: "center" }} category="h6">
        Almost done! We just need to verify your email address: {email}
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
            setButtonTxt("Resend Verification")
          }}
          style={{backgroundColor: "#5505BA", borderColor: "#5505BA"}}
        >
          {buttonTxt}
        </Button>
        <Button
          onPress={() => {
            console.log("done with verification");
            setVisible(true)
          }}
          style={{marginTop: 5, backgroundColor: "#5505BA", borderColor: "#5505BA"}}
        >
          Done
        </Button>
      </TouchableOpacity>
    </View>
  );
}
