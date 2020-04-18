import React, { useState, useEffect } from "react";
import { StyleSheet, FlatList, View } from "react-native";
import { Layout, Text, withStyles } from "@ui-kitten/components";
import { CommonActions } from "@react-navigation/native";
import { watchGroups } from "../utils/FirebaseUtils";

function ErrorScreen({ navigation }) {
  return (
    <View
      style={{ backgroundColor: "#FFFDF4", flex: 1, justifyContent: "center" }}
    >
      <View style={styles.m}>
        <Text category="h1"> v( ‘.’ )v {"\n"} </Text>
        <Text category="h6"> An unexpected error occurred! </Text>
        <Text category="h6"> Make sure you're connected to wifi </Text>
      </View>
    </View>
  );
}

export default withStyles(ErrorScreen, (theme) => ({
  light: {
    backgroundColor: theme["color-primary-100"],
  },
}));

const styles = StyleSheet.create({
  m: { alignItems: "center" },
});
