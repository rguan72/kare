import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TextInput,
  SectionList,
} from "react-native";
import PropTypes from "prop-types";
import {
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Layout, Button, Input, Text } from "@ui-kitten/components";
import ListItem from "../components/ListItem";
import {
  addComment,
  watchComments,
  reportComment,
} from "../utils/FirebaseUtils";
import { WOMEN } from "../../Images";
import analytics from "../utils/analytics";

export default function Thread({ route, navigation }) {
  const [comments, setComments] = useState([]);
  const [firstComments, setFirstComments] = useState([]);
  const [restComments, setRestComments] = useState([]);
  const [commentStructure, setCommentStructure] = useState([]);
  const [value, setValue] = useState("");
  const { title, description } = route.params;
  // hard coded for demo
  const userId = "ztKIibvRJFjoz26pztO4";

  useEffect(() => {
    const unsubscribe = watchComments(setComments);

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setCommentStructure([
      { title: "Most Recent", data: comments.slice(0, 3) },
      { title: "Older", data: comments.slice(4) },
    ]);
  }, [comments]);

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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={{ flex: 1 }}
    >
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "#F3EAFF",
        }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <React.Fragment>
            <SectionList
              sections={commentStructure}
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
                    onReply={() => {
                      navigation.navigate("Replies", {
                        user: item.userId,
                        comment: item.text,
                        commentId: item.id,
                        date: date,
                      });
                    }}
                    onReport={() => reportComment(item.id)}
                    date={date}
                    numReplies={item.numReplies}
                  />
                );
              }}
              keyExtractor={(item) => item.id}
              renderSectionHeader={({ section: { title } }) =>
                title == "Most Recent" ? (
                  <Text style={{ marginLeft: 25, marginBottom: 3 }}>
                    {title}
                  </Text>
                ) : (
                  <Text
                    style={{ marginLeft: 25, marginBottom: 3, marginTop: 10 }}
                  >
                    {title}
                  </Text>
                )
              }
            />
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
                  analytics.logComment();
                  addComment({
                    userId: userId,
                    text: value,
                    reports: 0,
                    show: true,
                    numReplies: 0,
                  });
                  setValue("");
                }}
                style={styles.mt0}
                disabled={value === ""}
              >
                Submit
              </Button>
            </Layout>
          </React.Fragment>
        </TouchableWithoutFeedback>
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
