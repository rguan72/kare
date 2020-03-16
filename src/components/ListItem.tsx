import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { Card, Text, Layout } from "@ui-kitten/components";
import { StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
import Emojis from "../constants/emojis";
import { getUser } from "../utils/FirebaseUtils";

export default function ListItem({ userId, text, onReport, date }) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("");
  const [color, setColor] = useState("");
  useEffect(() => {
    if (userId) {
      getUser(userId).then(userData => {
        setName(userData.name);
        setEmoji(userData.emoji);
        setColor(userData.color);
      });
    }
  }, [name]);
  const userEmoji = Emojis[emoji];
  return (
    <Card style={styles.card}>
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
        <Text style={styles.mb}>
          {emoji === "" ? "" : userEmoji()} {name}
        </Text>
        <Text style={{ color: "rgba(0, 0, 0, 0.3)" }}>
          {" * "}
          {date}
        </Text>
      </View>
      {/* </View> */}
      <Text category="h6"> {text} </Text>
      <TouchableOpacity onPress={onReport}>
        <Text style={styles.mt}> {Emojis.flag()} Report </Text>
      </TouchableOpacity>
    </Card>
  );
}

ListItem.propTypes = {
  userId: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  onReport: PropTypes.func.isRequired
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
  }
});
