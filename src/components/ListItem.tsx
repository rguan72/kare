import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { Card, Text, Layout } from "@ui-kitten/components";
import { StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
import Emojis from "../constants/emojis";
import Colors from "../constants/userColors";
import { getUser } from "../utils/FirebaseUtils";
import ListItemStyles from "../StyleSheets/ListItemStyles";

export default function ListItem({
  text,
  onReport,
  date,
  onReply,
  numReplies,
  showReplies,
  commenterName,
  color,
}) {
  const commentColor = Colors[color];

  const RepliesNumber = () => {
    if (showReplies == "True") {
      return (
        <View>
          <Text>{numReplies ? numReplies : 0} Replies </Text>
        </View>
      );
    } else {
      return null;
    }
  };

  return (
    <Card style={ListItemStyles.card} onPress={onReply}>
      <View style={{ flexDirection: "row" }}>
        <View
          style={[ListItemStyles.square, { backgroundColor: commentColor }]}
        />
        <Text style={ListItemStyles.userName}> {commenterName}</Text>
        <Text style={ListItemStyles.date}> {date}</Text>
      </View>
      {/* </View> */}
      <Text style={ListItemStyles.comments}>{text} </Text>
      <View style={ListItemStyles.bottomRow}>
        <RepliesNumber></RepliesNumber>
        <TouchableOpacity onPress={onReport}>
          <Text style={ListItemStyles.report}> Report</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

ListItem.propTypes = {
  text: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  onReport: PropTypes.func.isRequired,
  onReply: PropTypes.func.isRequired,
  commenterName: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};
