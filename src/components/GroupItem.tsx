import React from "react";
import { Text } from "@ui-kitten/components";
import { TouchableOpacity, View } from "react-native";
import PropTypes from "prop-types";
import GroupItemStyles from "../StyleSheets/GroupItemStyles";
import PureImage from "../components/PureImage";

export default function GroupItem({
  title,
  image,
  description,
  onPress,
  commentsSince,
}) {
  return (
    <TouchableOpacity onPress={onPress} style={GroupItemStyles.button}>
      <View style={GroupItemStyles.buttonBox}>
        <View style={GroupItemStyles.textBox}>
          <Text category='h5'>{title}</Text>
          <Text style={{ color: "#5505BA" }}>{commentsSince} new comments</Text>
        </View>
        <View style={GroupItemStyles.imageBox}>
          <PureImage style={GroupItemStyles.image} source={{ uri: image }} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

GroupItem.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  commentsSince: PropTypes.number.isRequired,
};
