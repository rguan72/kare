import React, { useState } from "react";
import { Card, Text, Layout } from "@ui-kitten/components";
import { StyleSheet } from "react-native";
import PropTypes from "prop-types";
import LikeButton from "./LikeButton";
import DislikeButton from "./DislikeButton";
import { HandEmoji } from "../constants/emojis";

export default function ListItem({ user, text, likes, onLike, onDislike }) {
  return (
    <Card style={styles.card}>
      <Text>
        <HandEmoji />
        <Text category="h5"> {user} </Text>
      </Text>
      <Text> {text} </Text>
      <Text> {likes} Likes </Text>
      <Layout style={{ flexDirection: "row" }}>
        <LikeButton onPress={onLike} />
        <DislikeButton onPress={onDislike} />
      </Layout>
    </Card>
  );
}

ListItem.propTypes = {
  user: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  likes: PropTypes.number.isRequired,
  onLike: PropTypes.func.isRequired,
  onDislike: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  card: {
    minWidth: 100
  }
});
