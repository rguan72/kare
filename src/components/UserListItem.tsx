import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { Card, Text, Layout } from "@ui-kitten/components";
import { StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
import Colors from "../constants/userColors"
import { getUser } from "../utils/FirebaseUtils";
import UserListItemStyles from "../StyleSheets/UserListItemStyles"

export default function UserListItem({ userId, text, onReport, date }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(Colors["purple"]); //default purple
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
    <Card style={UserListItemStyles.card}>
      {/* <View
        style={{
          width: 55,
          height: 55,
          borderRadius: 55 / 2,
          backgroundColor: Colors["red"],
          alignItems: "center",
          justifyContent: "center"
        }}
      > */}
      <View style={{ flexDirection: "row" }}>
        <View style={[UserListItemStyles.square, {backgroundColor: userColor}]} /> 
        <Text style={UserListItemStyles.userName}>
          {" "} 
          {name}
        </Text> 
        <Text style={UserListItemStyles.date}>
          {" * "}
          {date}
        </Text>
      </View>
      {/* </View> */}
      <Text category="h6"> {text} </Text>
      <TouchableOpacity onPress={onReport}>
        <Text style={UserListItemStyles.mt}> Delete Comment </Text>
      </TouchableOpacity>
    </Card>
  );
}

UserListItem.propTypes = {
  userId: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  onReport: PropTypes.func.isRequired
};

