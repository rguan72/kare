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
} from "react-native";
import { Layout, Button, Input, Text, Card } from "@ui-kitten/components";
import ListItem from "../components/ListItem";
import {
  addReply,
  watchReplies,
  reportComment,
  getUser,
  getComment,
  manageFollowing,
} from "../utils/FirebaseUtils";
import screens from "../constants/screenNames";
import Colors from "../constants/userColors";
import RepliesStyles from "../StyleSheets/RepliesStyles";
import { Notifications } from "expo";
import { managePushNotification } from "../utils/NotificationUtils";

export default function Replies({ route, navigation }) {
  const [replies, setReplies] = useState([]);
  const [value, setValue] = useState("");
  const [commenterName, setCommenterName] = useState("");
  const [userName, setUserName] = useState("");
  const [commenterColor, setCommenterColor] = useState(Colors.purple); // default

  const [following, setFollowing] = useState(null);
  const { commenterId, userId, comment, commentId, date } = route.params;

  const handleNotification = (notification) => {
    const { commenterId, comment, commentId, date } = notification.data;
    console.log(notification.data);
    navigation.navigate(screens.replies, {
      commenterId,
      comment,
      commentId,
      date,
      userId,
    });
  };

  useEffect(() => {
    const unsubscribe = watchReplies(commentId, setReplies);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    getUser(commenterId).then((userData) => {
      setCommenterName(userData.name);
      setCommenterColor(Colors[userData.color]);
    });
    getUser(userId).then((userData) => {
      setUserName(userData.name);
      if (
        Boolean(
          userData.comments_following.find((index) => index === commentId)
        )
      ) {
        // if user is following
        setFollowing(true);
      } else {
        setFollowing(false);
      }
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
              <TouchableOpacity style={RepliesStyles.touchable}>
                <Text
                  style={{ marginVertical: 1, marginHorizontal: 5 }}
                  onPress={() => {
                    manageFollowing(following, commentId, userId, setFollowing);
                  }}
                >
                  {following ? "Unfollow" : "Follow"}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={RepliesStyles.comment}>{comment}</Text>
          </Card>
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
                    onReport={() => reportComment(item.id)}
                    date={date}
                    onReply={() => {
                      navigation.navigate(screens.replies, {
                        userId: item.userId,
                        comment: item.text,
                        commentId: item.id,
                      });
                    }}
                    numReplies={item.numReplies}
                    showReplies='False'
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
                placeholder='Add comment'
                value={value}
                onChangeText={setValue}
              />
              <Button
                onPress={() => {
                  managePushNotification(value, replies, userId, userName, {
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
