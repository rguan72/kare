import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, FlatList } from "react-native";
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
import Colors from "../constants/userColors";

export default function Replies({ route, navigation }) {
  const [replies, setReplies] = useState([]);
  const [value, setValue] = useState("");
  const [name, setName] = useState("");
  const [userColor, setUserColor] = useState(Colors["purple"]); // default
  const { user, comment, commentId, date } = route.params;
  // hard coded for demo
  const userId = "ztKIibvRJFjoz26pztO4";
  //const userId = user; // something like this would be done in reality

  useEffect(() => {
    console.log("new reply");
    const unsubscribe = watchReplies(commentId, setReplies);
    console.log("Did it read?");
    return () => unsubscribe;
  }, []);

  useEffect(() => {
    getUser(user).then((userData) => {
      setName(userData.name);
      setUserColor(Colors[userData.color]);
    });
  }, []); // so it only runs once

  const ReplyParent = () => (
    <Layout style={[styles.mb, styles.bgColor, styles.mt]}>
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
          <Card style={styles.card}>
            <View style={{ flexDirection: "row" }}>
              <View
                style={[
                  styles.square,
                  { backgroundColor: userColor, marginRight: 5 },
                ]}
              />
              <Text style={styles.mb}> {name}</Text>
              <Text style={{ color: "rgba(0, 0, 0, 0.3)" }}>
                {" * "}
                {date}
              </Text>
            </View>
            <Text category='h6'> {comment} </Text>
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
                      navigation.navigate("Replies", {
                        user: item.userId,
                        comment: item.text,
                        commentId: item.id,
                      });
                    }}
                    numReplies={item.numReplies}
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
                  addReply(commentId, {
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

Replies.propTypes = {
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
    marginTop: 80,
  },
  bgColor: {
    backgroundColor: "#F3EAFF",
  },
  card: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 20,
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 44 / 2,
  },
  square: {
    width: 20,
    height: 20,
    borderRadius: 5,
    overflow: "hidden",
  },
});
