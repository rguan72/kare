import React, { useState } from "react";
import { Card, CardHeader, Button, Text } from "@ui-kitten/components";
import { StyleSheet, Image, TouchableOpacity, View } from "react-native";
import PropTypes from "prop-types";
import { WOMEN } from "../../Images";

export default function GroupItem({ title, description, text, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: "#F3EAFF",
        marginLeft: 10,
        marginRight: 10,
        marginTop: 20,
        borderRadius: 20,
        marginBottom: 10,
        shadowOffset: { width: 5, height: 5 },
        shadowColor: "black",
        shadowOpacity: 1.0,
        elevation: 5
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          justifyContent: "flex-end",
          alignItems: "center"
        }}
      >
        <View
          style={{
            flexDirection: "column"
          }}
        >
          <Text category="h4"> {title} </Text>
          <Text> {description}</Text>
        </View>
        <View
          style={{
            backgroundColor: "#F3EAFF",
            maxHeight: 100,
            marginLeft: 15,
            marginRight: 10
          }}
        >
          <Image
            source={WOMEN}
            style={{
              flexShrink: 1,
              maxWidth: 60,
              maxHeight: 60
            }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  footer: {
    justifyContent: "flex-end",
    flex: 1
  },
  flex: {
    display: "flex"
  },
  mt0: {
    marginTop: 0
  },
  mb: {
    marginBottom: 20
  },
  mt: {
    marginTop: 60
  },
  bgColor: {
    backgroundColor: "#F3EAFF"
  }
});

GroupItem.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired
};
