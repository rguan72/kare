import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TextInput,
} from "react-native";
import PropTypes from "prop-types";
import { KeyboardAvoidingView, ScrollView } from "react-native";
import { Layout, Button, Input, Text } from "@ui-kitten/components";
import ListItem from "../components/ListItem";
import {
  addComment,
  watchComments,
  reportComment,
} from "../utils/FirebaseUtils";
import { WOMEN } from "../../Images";

export default function Thread({ route }) {
  const [comments, setComments] = useState([]);
  const [value, setValue] = useState("");
  const { title, description } = route.params;
  // hard coded for demo
  const userId = "ztKIibvRJFjoz26pztO4";
  useEffect(() => {
    const unsubscribe = watchComments(setComments);
    return () => unsubscribe();
  }, []);

  const GroupTitle = () => (
    <Layout style={[styles.mb, styles.bgColor, styles.mt]}>
      <Layout
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          justifyContent: "flex-end",
          alignItems: "center",
          backgroundColor: "#F3EAFF",
          marginTop: 15,
          marginLeft: 40,
        }}
      >
        <Layout
          style={{
            flexDirection: "column",
            marginLeft: 10,
            backgroundColor: "#F3EAFF",
          }}
        >
          <Text category="h4"> {title} </Text>
          <Text> {description}</Text>
        </Layout>
        <Layout style={{ backgroundColor: "#F3EAFF", maxHeight: 100 }}>
          <Image
            source={WOMEN}
            style={{
              flexShrink: 1,
              maxWidth: 60,
              maxHeight: 60,
              marginLeft: 15,
            }}
          />
        </Layout>
      </Layout>
    </Layout>
  );

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "#F3EAFF",
        }}
      >
        {/* <ScrollView keyboardShouldPersistTaps="always"> */}
        <FlatList
          data={comments}
          ListHeaderComponent={GroupTitle}
          renderItem={({ item }) => {
            const date =
              item && item.timestamp
                ? item.timestamp.toDate().toLocaleDateString()
                : "";
            return (
              <ListItem
                userId={item.userId}
                text={item.text}
                onReport={() => reportComment(item.id)}
                date={date}
              />
            );
          }}
          keyExtractor={(item) => item.id}
        />
        {/* </ScrollView> */}
        <Layout
          style={{
            justifyContent: "flex-end",
            backgroundColor: "#F3EAFF",
            flexDirection: "column",
          }}
        >
          <Input
            placeholder="Add comment"
            value={value}
            onChangeText={setValue}
          />
          <Button
            onPress={() => {
              addComment({
                userId: userId,
                text: value,
                reports: 0,
                show: true,
              });
              setValue("");
            }}
            style={styles.mt0}
            disabled={value === ""}
          >
            Submit
          </Button>
        </Layout>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

Thread.propTypes = {
  route: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  footer: {
    justifyContent: "flex-end",
    flex: 1,
  },
  flex: {
    display: "flex",
  },
  mt0: {
    marginTop: 0,
  },
  mb: {
    marginBottom: 20,
  },
  mt: {
    marginTop: 60,
  },
  bgColor: {
    backgroundColor: "#F3EAFF",
  },
});
