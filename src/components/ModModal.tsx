import React from "react";
import { Modal, Card, Text, Button } from "@ui-kitten/components";
import ThreadStyles from "../StyleSheets/ThreadStyles";
import { ModTypesEnum } from "../Models";

interface ModModalProps {
  shVisible: boolean;
  setshVisible: any;
  type: ModTypesEnum;
}

export default function ModModal(props: ModModalProps) {
  const { shVisible, setshVisible, type } = props;
  let modal;
  if (type === ModTypesEnum.selfHarm) {
    modal = (
      <Modal
        visible={shVisible}
        backdropStyle={ThreadStyles.backdrop}
        onBackdropPress={() => setshVisible(false)}
      >
        <Card disabled={true}>
          <Text>
            The comment you submitted has language that goes against our
            community guidelines. Please submit a different comment. Anyone
            experiencing thoughts of suicide can seek help from: The 24-hour
            National Suicide Prevention Lifeline at 1-800-273-TALK (8255). The
            Ozone House, a 24-hour hotline for youth, at 734-662-2222. The
            24-hour hotline at University of Michigan Psychiatric Emergency
            Services at 734-936-5900. The Washtenaw County Community Mental
            Health crisis team at 734-544-3050
          </Text>
          <Button onPress={() => setshVisible(false)}>DISMISS</Button>
        </Card>
      </Modal>
    );
  } else if (type === ModTypesEnum.offensive) {
    modal = (
      <Modal
        visible={shVisible}
        backdropStyle={ThreadStyles.backdrop}
        onBackdropPress={() => setshVisible(false)}
      >
        <Card disabled={true}>
          <Text>
            The comment you submitted has language that goes against our
            community guidelines. Please submit a different comment.
          </Text>
          <Button onPress={() => setshVisible(false)}>DISMISS</Button>
        </Card>
      </Modal>
    );
  }
  return modal;
}
