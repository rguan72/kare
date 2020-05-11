import React, { useState } from "react";
import { Text, Modal, Button, Card } from "@ui-kitten/components";
import {
  Image,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import PropTypes from "prop-types";
import GroupItemStyles from "../StyleSheets/GroupItemStyles";
import { Ionicons } from "@expo/vector-icons";
import * as Analytics from "expo-firebase-analytics";
import { removeGroupFromUser } from "../utils/FirebaseUtils";

export default function UserGroupItem({
  title,
  image,
  description,
  onCancel,
  groupId,
}) {
  const [visible, setVisible] = useState(false);
  const [caption, setCaption] = useState("");

  const onIconPress = () => {
    setCaption(`Are you sure you want to leave group ${title}?`);
    setVisible(true);
  };

  return (
    <View style={styles.button}>
      <React.Fragment>
        <View style={styles.buttonBox}>
          <View style={styles.textBox}>
            <View style={{ flex: 10 }}>
              <Text category="h5">{title}</Text>
              <Text>{description}</Text>
            </View>
            <TouchableOpacity
              style={{ flex: 1, paddingLeft: 5 }}
              onPress={onIconPress}
            >
              <Ionicons name="ios-trash" size={40} />
            </TouchableOpacity>
          </View>
          <View style={styles.imageBox}>
            <Image style={styles.image} source={{ uri: image }} />
          </View>
        </View>
        <Modal visible={visible}>
          <Card disabled={true}>
            <Text>{caption}</Text>
            <Button
              onPress={() => {
                removeGroupFromUser(groupId);
                onCancel();
                setVisible(false);
                Analytics.logEvent("Group Left", {
                  name: "group left",
                  screen: "ManageGroups",
                  purpose: "Leave a group user doesn't want to be in",
                });
              }}
              style={styles.groupButton}
            >
              YES
            </Button>
            <Button
              onPress={() => setVisible(false)}
              style={styles.groupButton}
            >
              NO
            </Button>
          </Card>
        </Modal>
      </React.Fragment>
    </View>
  );
}

UserGroupItem.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  groupId: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  groupButton: {
    marginTop: 24,
    marginLeft: 30,
    marginRight: 30,
    borderColor: "#5505BA",
    backgroundColor: "#5505BA",
  },
  button: {
    backgroundColor: "#F3EAFF",
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
    borderRadius: 20,
    marginBottom: 10,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "black",
    shadowOpacity: 0.5,
    elevation: 5,
  },
  buttonBox: {
    display: "flex",
    flexDirection: "row-reverse",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingVertical: 20,
    paddingLeft: 20,
  },
  textBox: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  imageBox: {
    backgroundColor: "#F3EAFF",
    maxHeight: 100,
    marginLeft: 15,
    marginRight: 10,
  },
  image: {
    resizeMode: "contain",
    width: 60,
    height: 60,
  },
});
