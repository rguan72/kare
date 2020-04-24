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
    <TouchableWithoutFeedback style={GroupItemStyles.button}>
      <React.Fragment>
        <View style={GroupItemStyles.buttonBox}>
          <View style={GroupItemStyles.textBox}>
            <Text category='h4'>{title}</Text>
            <Text>{description}</Text>
            <TouchableOpacity
              style={{ alignSelf: "flex-end" }}
              onPress={onIconPress}
            >
              <Ionicons name='ios-close-circle-outline' size={20} />
            </TouchableOpacity>
          </View>
          <View style={GroupItemStyles.imageBox}>
            <Image style={GroupItemStyles.image} source={{ uri: image }} />
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
              }}
              style={styles.button}
            >
              YES
            </Button>
            <Button onPress={() => setVisible(false)} style={styles.button}>
              NO
            </Button>
          </Card>
        </Modal>
      </React.Fragment>
    </TouchableWithoutFeedback>
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
  button: {
    marginTop: 24,
    marginLeft: 30,
    marginRight: 30,
    borderColor: "#5505BA",
    backgroundColor: "#5505BA",
  },
});
