import React, { useState } from "react";
import { Card, CardHeader, Button, Text } from "@ui-kitten/components";
import { StyleSheet } from "react-native";
import PropTypes from "prop-types";

export default function GroupItem({ title, description, text, onPress }) {
  return (
    <Card
      header={() => (
        <CardHeader title={title} description={description} onPress={onPress} />
      )}
      onPress={onPress}
    >
      <Text> {text} </Text>
    </Card>
  );
}

GroupItem.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired
};
