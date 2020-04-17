import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { Card, Text, Layout } from "@ui-kitten/components";
import { StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
import Emojis from "../constants/emojis";
import Colors from "../constants/userColors"
import { getUser } from "../utils/FirebaseUtils";
import ListItemStyles from "../StyleSheets/ListItemStyles"

export default function ListItem({ userId, text, onReport, date, onReply, numReplies }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(Colors["purple"]); //defualt purple
  useEffect(() => {
    if (userId) { 
      getUser(userId).then(userData => {
        setName(userData.name);
        setColor(userData.color);
      });
    }
  }, [name]);
  const userColor = Colors[color];

  return (
    <Card style={ListItemStyles.card} >
      <View style={{ flexDirection: "row" }}>
        <View style={[ListItemStyles.square, {backgroundColor: userColor}]} /> 
        <Text style={ListItemStyles.userName}>
          {" "} 
          {name}
        </Text> 
        <Text style={ListItemStyles.date}>
          {" * "}
          {date}
        </Text>
      </View>
      {/* </View> */}
      <Text category="h6"> {text} </Text>
      <View style={ListItemStyles.bottomRow} >
        <TouchableOpacity onPress={onReply}>
          <Text >{numReplies ? numReplies : 0} Replies </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onReport}>
          <Text > {Emojis.flag()} Flag </Text>
          <Text style={ListItemStyles.report}> Report</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

ListItem.propTypes = {
  userId: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  onReport: PropTypes.func.isRequired,
  onReply: PropTypes.func.isRequired
};
