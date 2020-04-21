import React, { useState } from "react";
import { Card, CardHeader, Button, Text } from "@ui-kitten/components";
import { StyleSheet, Image, TouchableOpacity, View } from "react-native";
import PropTypes from "prop-types";
import { WOMEN } from "../../Images";
import GroupItemStyles from "../StyleSheets/GroupItemStyles"

export default function GroupItem({ title, image, description, text, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={GroupItemStyles.button}
    >
      <View
        style={GroupItemStyles.buttonBox}
      >
        <View
          style={GroupItemStyles.textBox}
        >
          <Text category="h4">{title}</Text>
          <Text>{description}</Text>
        </View>
        <View
          style={GroupItemStyles.imageBox}
        >
          <Image
            style={GroupItemStyles.image}
            source={{uri: image}}
          />
         </View>
      </View>
    </TouchableOpacity>
  );
}

GroupItem.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired
};
