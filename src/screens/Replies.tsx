import React, { useState, useEffect } from "react";
import { SafeAreaView, FlatList } from "react-native";
import PropTypes from "prop-types";
import {
  KeyboardAvoidingView,
  View,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import * as Analytics from "expo-firebase-analytics";
import { Layout, Text, Card } from "@ui-kitten/components";
import ListItem from "../components/ListItem";
import PureImage from "../components/PureImage";
import {
  addReply,
  watchReplies,
  getUser,
  followComment,
} from "../utils/FirebaseUtils";
import screens from "../constants/screenNames";
import Colors from "../constants/userColors";
import RepliesStyles from "../StyleSheets/RepliesStyles";
import ReportDialogue from "../components/ReportDialogue";
import ButtonLayout from "../components/ButtonLayout";
import { Notifications } from "expo";

export default function Replies({ route, navigation }) {
  const [replies, setReplies] = useState([]);
  const [showReportDialogue, setShowReportDialogue] = useState(false);
  const [reporterID, setReporterID] = useState("");
  const [reporteeID, setReporteeID] = useState("");
  const [reportedComment, setReportedComment] = useState("");
  const [reportedCommentID, setReportedCommentID] = useState("");
  const [commenterName, setCommenterName] = useState("");
  const [commenterColor, setCommenterColor] = useState(Colors.purple); // default
  const [user, setUser] = useState();
  const [following, setFollowing] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const { commenterId, userId, comment, commentId, date } = route.params;

  useEffect(() => {
    Analytics.setCurrentScreen("Replies");
  }, []);

  useEffect(() => {
    const unsubscribe = watchReplies(commentId, setReplies, setLoading);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setImageLoading(true);
    getUser(commenterId).then((userData) => {
      setCommenterName(userData.name);
      setCommenterColor(Colors[userData.color]);
    });
    getUser(userId).then((userData) => {
      setUser(userData);
      if (
        Boolean(
          userData.comments_following.find(
            (commentIdx) => commentIdx === commentId
          )
        )
      ) {
        // if user is following
        setFollowing(true);
      } else {
        setFollowing(false);
      }
      setImageLoading(false);
    });

    const handleNotification = (notification) => {
      const { commenterId, comment, commentId, date } = notification.data;

      navigation.navigate(screens.replies, {
        commenterId,
        comment,
        commentId,
        date,
        userId,
      });
    };

    const _notificationSubscription = Notifications.addListener(
      handleNotification
    );
  }, []); // so it only runs once

  const ReplyParent = (
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
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ flexDirection: "row" }}>
                <View
                  style={[
                    RepliesStyles.square,
                    { backgroundColor: commenterColor, marginRight: 5 },
                  ]}
                />
                <Text style={RepliesStyles.userName}> {commenterName}</Text>
                <Text style={RepliesStyles.date}>
                  {" * "}
                  {date}
                </Text>
              </View>
              {imageLoading || !following ? (
                <Text></Text>
              ) : (
                <PureImage
                  source={require("../../assets/follow-icon.png")}
                  style={{
                    height: 20,
                    width: 20,
                    resizeMode: "contain",
                  }}
                />
              )}
            </View>
            <Text style={RepliesStyles.comment}>{comment}</Text>
          </Card>
        </Layout>
      </Layout>
    </Layout>
  );
  const handleReportDialogue = (reporterID, reporteeID, comment, commentId) => {
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
      style={{ flex: 1 }}
    >
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "#F3EAFF",
        }}
      >
        <ReportDialogue
          reporterID={reporterID}
          reporteeID={reporteeID}
          comment={reportedComment}
          commentRef={reportedCommentID}
          closeReportDialogue_={closeReportDialogue}
          showReportDialogue_={showReportDialogue}
        ></ReportDialogue>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <React.Fragment>
            {loading ? (
              <ActivityIndicator
                size="large"
                style={{ flex: 1 }}
                color="#5505BA"
                animating={loading}
              />
            ) : (
              <>
                <FlatList
                  data={replies}
                  ListHeaderComponent={ReplyParent} // going to be comment
                  renderItem={({ item }) => {
                    const date =
                      item && item.timestamp
                        ? item.timestamp.toDate().toLocaleDateString() +
                          " " +
                          item.timestamp.toDate().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "";
                    return (
                      <ListItem
                        text={item.text}
                        onReport={() =>
                          handleReportDialogue(
                            item.userId,
                            route.params.userId,
                            item.text,
                            item.id
                          )
                        }
                        date={date}
                        onReply={() => null}
                        numReplies={item.numReplies}
                        showReplies={false}
                        color={item.color}
                        commenterName={item.commenterName}
                        commentId={item.id}
                        userId={userId}
                        commenterId={item.userId}
                      />
                    );
                  }}
                  keyExtractor={(item) => item.id}
                />
                <ButtonLayout
                  user={user}
                  userId={userId}
                  comment={comment}
                  commentId={commentId}
                  commenterId={commenterId}
                  date={date}
                />
              </>
            )}
          </React.Fragment>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

Replies.propTypes = {
  route: PropTypes.object.isRequired,
};
