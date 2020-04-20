import React, { useState } from "react";
import firebase from "firebase/app";
import { View, TouchableOpacity } from "react-native";
import { Modal, Card, Text, Button } from "@ui-kitten/components";
import screens from "../constants/screenNames";
import { sendVerificationEmail, getCurrentUser } from "../utils/FirebaseUtils";
import VerifyStyles from "../StyleSheets/VerifyStyles";

export default function VerifyEmail({ navigation }) {
  let email;
  const user = getCurrentUser();
  const [visible, setVisible] = useState(false);
  const [buttonTxt, setButtonTxt] = useState("Send Verification");
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
    <View style={VerifyStyles.parent}>
      <Text style={{ textAlign: "center" }} category="h6">
        Almost done! We just need to verify your email address: {email}
      </Text>
      <Modal visible={visible}>
        <Card disabled={true}>
          <Text>
            {" "}
            Once you've clicked the link in the verification email, you're ready
            to login.{" "}
          </Text>
          <Button onPress={() => onSignOut()} style={VerifyStyles.closeButton}>
            CLOSE
          </Button>
        </Card>
      </Modal>
      <TouchableOpacity style={VerifyStyles.mt} disabled>
        <Button
          onPress={() => {
            console.log("sent email");
            sendVerificationEmail();
            setButtonTxt("Resend Verification");
          }}
          style={VerifyStyles.verifyButton}
        >
          {buttonTxt}
        </Button>
        <Button
          onPress={() => {
            console.log("done with verification");
            setVisible(true);
          }}
          style={VerifyStyles.doneButton}
        >
          Done
        </Button>
      </TouchableOpacity>
    </View>
  );
}
