import React, { useState, useEffect } from "react";
import { SafeAreaView, FlatList } from "react-native";
import PropTypes from "prop-types";
import {
  KeyboardAvoidingView,
  View,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Layout, Button, Input, Text, Card } from "@ui-kitten/components";
import ListItem from "../components/ListItem";
import {
  addReply,
  watchReplies,
  reportComment,
  getUser,
} from "../utils/FirebaseUtils";
import screens from "../constants/screenNames";
import Colors from "../constants/userColors";
import RepliesStyles from "../StyleSheets/RepliesStyles";
import ReportDialogue from "../components/ReportDialogue";

export default function Replies({ route, navigation }) {
  const [replies, setReplies] = useState([]);
  const [value, setValue] = useState("");
  const [name, setName] = useState("");
  const [userColor, setUserColor] = useState(Colors.purple); // default
  const [showReportDialogue, setShowReportDialogue] = useState(false);
  const [reporterID, setReporterID] = useState("");
  const [reporteeID, setReporteeID] = useState("");
  const [reportedComment, setReportedComment] = useState("");
  const [reportedCommentID, setReportedCommentID] = useState("");
  const { commenterId, userId, comment, commentId, date } = route.params;

  useEffect(() => {
    const unsubscribe = watchReplies(commentId, setReplies);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    getUser(commenterId).then((userData) => {
      setName(userData.name);
      setUserColor(Colors[userData.color]);
    });
  }, []); // so it only runs once

  const ReplyParent = () => (
    <Layout style={[RepliesStyles.mb, RepliesStyles.bgColor, RepliesStyles.mt]}>
      <Layout
        style={{
          backgroundColor: "#F3EAFF",
        }}
      >
        <Layout
          style={{
            flexDirection: "column",
            backgroundColor: "#F3EAFF",
          }}
        >
          <Card style={RepliesStyles.card}>
            <View style={{ flexDirection: "row" }}>
              <View
                style={[
                  RepliesStyles.square,
                  { backgroundColor: userColor, marginRight: 5 },
                ]}
              />
              <Text style={RepliesStyles.mb}> {name}</Text>
              <Text style={{ color: "rgba(0, 0, 0, 0.3)" }}>
                {" * "}
                {date}
              </Text>
            </View>
            <Text category="h6"> {comment} </Text>
          </Card>
        </Layout>
      </Layout>
    </Layout>
  );
  const handleReportDialogue = (reporterID,reporteeID,comment,commentId) => {
    setReporterID(reporterID);
    setReporteeID(reporteeID);
    setReportedComment(comment);
    setReportedCommentID(commentId);
    closeReportDialogue();
  }
  const closeReportDialogue = () => {
    setShowReportDialogue(!showReportDialogue);
  }

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
      {showReportDialogue && <ReportDialogue 
        reporterID={reporterID}
        reporteeID={reporteeID}
        comment={reportedComment}
        commentRef={reportedCommentID}
        closeReportDialogue_={closeReportDialogue}
      >
      </ReportDialogue>}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <React.Fragment>
            <FlatList
              data={replies}
              ListHeaderComponent={ReplyParent} // going to be comment
              renderItem={({ item }) => {
                const date =
                  item && item.timestamp
                    ? item.timestamp.toDate().toLocaleDateString()
                    : "";
                return (
                  <ListItem
                    userId={item.userId}
                    text={item.text}
                    onReport={() => handleReportDialogue(item.userId,route.params.userId,item.text,item.id)}
                    date={date}
                    onReply={() => {
                      navigation.navigate(screens.replies, {
                        userId: item.userId,
                        comment: item.text,
                        commentId: item.id,
                      });
                    }}
                    numReplies={item.numReplies}
		    showReplies="False"
                  />
                );
              }}
              keyExtractor={(item) => item.id}
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
                  addReply(commentId, {
                    userId: userId,
                    text: value,
                    reports: 0,
                    show: true,
                    numReplies: 0,
                  });
                  setValue("");
                }}
                style={RepliesStyles.mt0}
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

Replies.propTypes = {
  route: PropTypes.object.isRequired,
};
