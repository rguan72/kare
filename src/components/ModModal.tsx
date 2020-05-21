import React from "react";
import { Modal, Card, Text, Button } from "@ui-kitten/components";
import Anchor from "../components/Anchor";
import ThreadStyles from "../StyleSheets/ThreadStyles";

export default function ModModal({ shVisible, setshVisible }) {
  return (
    <Modal
      visible={shVisible}
      backdropStyle={ThreadStyles.backdrop}
      onBackdropPress={() => setshVisible(false)}
    >
      <Card disabled={true}>
        <Text>Click </Text>
        <Anchor href="https://google.com">Here</Anchor>
        <Text>Welcome to UI Kitten 😻</Text>
        <Button onPress={() => setshVisible(false)}>DISMISS</Button>
      </Card>
    </Modal>
  );
}
