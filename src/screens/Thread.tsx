import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native";
import PropTypes from "prop-types";
import {
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Layout, Button, Input } from "@ui-kitten/components";
import ListSearchView from "../components/ListSearchView";
import { addComment, getUser } from "../utils/FirebaseUtils";
import ThreadStyles from "../StyleSheets/ThreadStyles";
import ReportDialogue from "../components/ReportDialogue";

export default function Thread({ route, navigation }) {
  const {
    userId,
    title,
    description,
    groupId,
    image,
    num_members,
  } = route.params;
  const [showReportDialogue, setShowReportDialogue] = useState(false);
  const [reporterID, setReporterID] = useState("");
  const [reporteeID, setReporteeID] = useState("");
  const [reportedComment, setReportedComment] = useState("");
  const [reportedCommentID, setReportedCommentID] = useState("");

  const [user, setUser] = useState();
  const [commentsLoading, setCommentsLoading] = useState(true);

  useEffect(() => {
    getUser(userId).then((userData) => {
      setUser(userData);
    });
  }, []);

  const ButtonLayout = () => {
    const [value, setValue] = useState("");
    return (
      <Layout style={ThreadStyles.commentBox}>
        <Input
          multiline
          placeholder="Add comment"
          value={value}
          onChangeText={(e) => setValue(e)}
        />
        <Button
          onPress={() => {
            addComment(
              {
                userId: userId,
                text: value,
                reports: 0,
                show: true,
                numReplies: 0,
                color: user.color,
                commenterName: user.name,
              },
              groupId
            );
            setValue("");
          }}
          style={ThreadStyles.submitButton}
          disabled={value === ""}
        >
          Submit
        </Button>
      </Layout>
    );
  };
  const handleReportDialogue = (
    reporterID: string,
    reporteeID: string,
    comment: string,
    commentId: string
  ) => {
    setReporterID(reporterID);
    setReporteeID(reporteeID);
    setReportedComment(comment);
    setReportedCommentID(commentId);
    closeReportDialogue();
  };
  const closeReportDialogue = () => {
    setShowReportDialogue(!showReportDialogue);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={ThreadStyles.keyboardAvoidingView}
    >
      <SafeAreaView style={ThreadStyles.safeAreaView}>
        <ReportDialogue
          reporterID={reporterID}
          reporteeID={reporteeID}
          comment={reportedComment}
          commentRef={reportedCommentID}
          showReportDialogue_={showReportDialogue}
          closeReportDialogue_={closeReportDialogue}
        />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <React.Fragment>
            <ListSearchView
              userId={userId}
              groupId={groupId}
              commentsLoading={commentsLoading}
              setCommentsLoading={setCommentsLoading}
              navigation={navigation}
              handleReportDialogue={handleReportDialogue}
              title={title}
              description={description}
              image={image}
              num_members={num_members}
            />
            <ButtonLayout />
          </React.Fragment>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

Thread.propTypes = {
  route: PropTypes.object.isRequired,
};
