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
import { Ionicons } from "@expo/vector-icons";
import { CheckBox } from 'react-native-elements'

export default function SurveyGroupItem({
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
    <View style={styles.textbox}>
      <View style={styles.buttonBox}>
        <View style={styles.textBox}>
          <View style={{ flex: 10 }}>
            <Text category='h6'>{title}</Text>
            <Text>{description}</Text>
          </View>
        </View>
        <View style={styles.imageBox}>
          <Image style={styles.image} source={{ uri: image }} />
        </View>
      </View>
    </View>
  );
}


SurveyGroupItem.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  groupId: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({

  buttonBox: {
    display: "flex",
    flexDirection: "row-reverse",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingVertical: 20,
    paddingLeft: 20,
  },
  textBox: {
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  imageBox: {
    backgroundColor: "#F3EAFF",
    maxHeight: 100,
    marginLeft: 5,
    marginRight: 10,
  },
  image: {
    resizeMode: "contain",
    width: 40,
    height: 40,
  },
});
