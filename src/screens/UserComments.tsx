import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
} from "react-native";
import PropTypes from "prop-types";
import { Layout, Button, Input, Text } from "@ui-kitten/components";
import UserListItem from "../components/UserListItem";
import {
  getUserComments,
  reportComment,
  getUser,
} from "../utils/FirebaseUtils";
import UserCommentsStyles from "../StyleSheets/UserCommentsStyles"

export default function UserComments({ route }) {
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  //const { userId } = route.params; // usually it would be this
  // hard coded for demo
  const userId = "ztKIibvRJFjoz26pztO4";

  useEffect(() => {
    getUser(userId).then((userData) => {
      setName(userData.name);
    });
  }, []);

  useEffect(() => {
    getUserComments(userId).then((data) => setComments(data));
  }, []); // get once

  const GroupTitle = () => (
    <Layout style={UserCommentsStyles.header}>
      <Layout style={UserCommentsStyles.headerTextbox}>
        <Text category='h4'>{name}</Text>
        <Text>Comment Summary:</Text>
      </Layout>
      <Layout style={{ backgroundColor: "#F3EAFF", maxHeight: 100 }}></Layout>
    </Layout>
  );

  return (
    <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>
      <SafeAreaView style={UserCommentsStyles.safeAreaView}>
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
              <UserListItem
                userId={item.userId}
                text={item.text}
                onReport={() => reportComment(userId)}
                date={date}
              />
            );
          }}
          keyExtractor={(item) => item.id}
        />
        {/* </ScrollView> */}
        <Layout style={UserCommentsStyles.commentBox}></Layout>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

UserComments.propTypes = {
  route: PropTypes.object.isRequired,
};
