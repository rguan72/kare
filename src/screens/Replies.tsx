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

export default function Replies({ route, navigation }) {
  const [replies, setReplies] = useState([]);
  const [value, setValue] = useState("");
  const [name, setName] = useState("");
  const [commenterColor, setCommenterColor] = useState(Colors.purple); // default
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const { commenterId, userId, comment, commentId, date } = route.params;

  useEffect(() => {
    getUser(userId).then((userData) => {
      setUser(userData);
    });
    getUser(commenterId).then((userData) => {
      setName(userData.name);
      setCommenterColor(Colors[userData.color]);
    });
  }, []); // so it only runs once

  useEffect(() => {
    const unsubscribe = watchReplies(commentId, setReplies, setLoading);
    return () => unsubscribe();
  }, []);

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
              <Text style={RepliesStyles.userName}>{name}</Text>
              <Text style={RepliesStyles.date}>
                {" * "}
                {date}
              </Text>
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
                        onReport={() => reportComment(item.id)}
                        date={date}
                        onReply={() => {
                          return null;
                        }}
                        numReplies={item.numReplies}
                        showReplies="False"
                        color={item.color}
                        commenterName={item.commenterName}
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
                        color: user.color,
                        commenterName: user.name,
                      });
                      setValue("");
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
