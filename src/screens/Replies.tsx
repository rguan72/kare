import React, { useState, useEffect } from "react";
import { SafeAreaView, FlatList } from "react-native";
import PropTypes from "prop-types";
import {
  KeyboardAvoidingView,
  View,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import * as Analytics from "expo-firebase-analytics";
import { Layout, Button, Input, Text, Card } from "@ui-kitten/components";
import ListItem from "../components/ListItem";
import {
  addReply,
  watchReplies,
  reportComment,
  getUser,
  followComment,
  manageFollowing,
} from "../utils/FirebaseUtils";
import screens from "../constants/screenNames";
import Colors from "../constants/userColors";
import RepliesStyles from "../StyleSheets/RepliesStyles";
import ReportDialogue from "../components/ReportDialogue";
import { Notifications } from "expo";
import { managePushNotification } from "../utils/NotificationUtils";

export default function Replies({ route, navigation }) {
  const [replies, setReplies] = useState([]);
  const [value, setValue] = useState("");
  const [name, setName] = useState("");
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
    getUser(userId).then((userData) => {
      setUser(userData);
    });
    getUser(commenterId).then((userData) => {
      setName(userData.name);
      setCommenterColor(Colors[userData.color]);

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

    const _notificationSubscription = Notifications.addListener(
      handleNotification
    );
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
                  { backgroundColor: commenterColor, marginRight: 5 },
                ]}
              />
              <Text style={RepliesStyles.userName}> {commenterName}</Text>
              <Text style={RepliesStyles.date}>
                {" * "}
                {date}
              </Text>
              {imageLoading ? (
                <Text></Text>
              ) : (
                <TouchableOpacity
                  style={RepliesStyles.touchable}
                  onPress={() => {
                    manageFollowing(following, commentId, userId, setFollowing);
                  }}
                >
                  {following ? (
                    /*<Image
                      source={require("../../assets/unfollow.png")}
                      style={{ height: 20, width: 20, resizeMode: "contain" }}
                    />Keep these comments in case we want to change back*/
                    <Text style={{ fontSize: 12, opacity: 0.5, padding: 1 }}>
                      Following
                    </Text>
                  ) : (
                    /*<Image
                      source={require("../../assets/follow-icon.png")}
                      style={{ height: 20, width: 20, resizeMode: "contain" }}
                    />*/
                    <Text></Text>
                  )}
                </TouchableOpacity>
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
                size='large'
                style={{ flex: 1 }}
                color='#5505BA'
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
                        onReply={() => {
                          return null;
                        }}
                        numReplies={item.numReplies}
                        showReplies='False'
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
                <Layout
                  style={{
                    justifyContent: "flex-end",
                    backgroundColor: "#F3EAFF",
                    flexDirection: "column",
                  }}
                >
                  <Input
                    multiline
                    placeholder='Add comment'
                    value={value}
                    onChangeText={setValue}
                  />
                  <Button
                    onPress={() => {
                      followComment(commentId, userId);
                      setFollowing(true);
                      managePushNotification(value, userId, user.name, {
                        commenterId,
                        comment,
                        commentId,
                        date,
                      });
                      addReply(commentId, {
                        userId: userId,
                        text: value,
                        reports: 0,
                        show: true,
                        numReplies: 0,
                        color: user.color,
                        commenterName: user.name,
                      });
                      setValue("");
                      Analytics.logEvent(`Reply Submitted`, {
                        name: "reply",
                        screen: "Replies",
                        purpose: "Reply to a comment",
                      });
                    }}
                    style={RepliesStyles.mt0}
                    disabled={value === ""}
                  >
                    Submit
                  </Button>
                </Layout>
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
