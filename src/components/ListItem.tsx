import React from "react";
import { TouchableOpacity, Image } from "react-native";
import { Card, Text } from "@ui-kitten/components";
import { View } from "react-native";
import PropTypes from "prop-types";
import Colors from "../constants/userColors";
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
  following,
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
      <Text style={ListItemStyles.comments}>{text} </Text>
      <View style={ListItemStyles.bottomRow}>
        <RepliesNumber></RepliesNumber>
        {showReplies === "False" ? (
          <Text></Text>
        ) : following ? (
          <Image
            source={require("../../assets/unfollow.png")}
            style={ListItemStyles.image}
          />
        ) : (
          <Image
            source={require("../../assets/follow-icon.png")}
            style={ListItemStyles.image}
          />
        )}
        <TouchableOpacity
          onPress={onReport}
          style={{ position: "absolute", right: 0 }}
        >
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
  following: PropTypes.bool.isRequired,
};
