import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { Card, Text, Layout } from "@ui-kitten/components";
import { StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
import Emojis from "../constants/emojis";
import Colors from "../constants/userColors"
import { getUser } from "../utils/FirebaseUtils";

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
    <Card style={styles.card} >
      <View style={{ flexDirection: "row" }}>
        <View style={[styles.square, {backgroundColor: userColor, marginRight: 5}]} /> 
        <Text style={styles.mb}>
          {" "} 
          {name}
        </Text> 
        <Text style={{ color: "rgba(0, 0, 0, 0.3)" }}>
          {" * "}
          {date}
        </Text>
      </View>
      {/* </View> */}
      <Text category="h6"> {text} </Text>
      <View style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: 'space-between'
        }} >
        <TouchableOpacity onPress={onReply}>
          <Text style={styles.mt}>{numReplies ? numReplies : 0} Replies </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onReport}>
          <Text style={styles.mt}> {Emojis.flag()} Flag </Text>
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

const styles = StyleSheet.create({
  card: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 20
  },
  mt: {
    marginTop: 20
  },
  mb: {
    marginBottom: 10
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 44 / 2
  },
  square: {
    width: 20,
    height: 20,
    borderRadius: 5,
    overflow: "hidden"
  }
});
