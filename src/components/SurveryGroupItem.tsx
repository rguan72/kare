import React, { useState } from "react";
import { Card, CardHeader, Button, Text } from "@ui-kitten/components";
import { StyleSheet, Image, TouchableOpacity, View } from "react-native";
import PropTypes from "prop-types";
import { WOMEN } from "../../Images";
import GroupItemStyles from "../StyleSheets/GroupItemStyles"

export default function SurveyGroupItem({
  title,
  image,
  description,
  onCancel,
  groupId,
}) {
  const [visible, setVisible] = useState(false);
  const [caption, setCaption] = useState("");

  return (
    <View style={styles.textbox}>
      <React.Fragment>
        <View style={styles.buttonBox}>
          <View style={styles.textBox}>
            <View style={{ flex: 10 }}>
              <Text category='h5'>{title}</Text>
              <Text>{description}</Text>
            </View>
          </View>
          <View style={styles.imageBox}>
            <Image style={styles.image} source={{ uri: image }} />
          </View>
        </View>
      </React.Fragment>
    </View>
  );
}

UserGroupItem.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
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
    width: 60,
    height: 60,
  },
});
