import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { Card, Text, Layout } from "@ui-kitten/components";
import { StyleSheet } from "react-native";
import PropTypes from "prop-types";
import Emojis from "../constants/emojis";
import { getUser } from "../utils/FirebaseUtils";

export default function ListItem({ userId, text, onReport }) {
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
      <Text style={styles.mb}>
        {emoji === "" ? "" : userEmoji()} {name}
      </Text>
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
  }
});
