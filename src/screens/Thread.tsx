import React, { useState, useEffect } from "react";
import {
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
import ThreadStyles from "../StyleSheets/ThreadStyles"

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
    <Layout style={ThreadStyles.header}>
      {/* text box */}
        <Layout
          style={ThreadStyles.headerTextBox}
        >
          <Text category="h4"> {title} </Text>
          <Text> {description}</Text>
        </Layout>
        {/* image box */}
        <Layout style={{ backgroundColor: "#F3EAFF", maxHeight: 100 }}>
          <Image
            source={WOMEN}
            style={ThreadStyles.icon}
          />
        </Layout>
    </Layout>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={ThreadStyles.keyboardAvoidingView}
    >
      <SafeAreaView
        style={ThreadStyles.safeAreaView}
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
                (<Text style={ThreadStyles.sectionHeader}> {title} </Text>)
              }
            />
            <Layout
              style={ThreadStyles.commentBox}
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
                style={ThreadStyles.submitButton}
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
