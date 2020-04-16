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
          <Text category='h4'>{name}</Text>
          <Text>Comment Summary:</Text>
        </Layout>
        <Layout style={{ backgroundColor: "#F3EAFF", maxHeight: 100 }}></Layout>
      </Layout>
    </Layout>
  );

  return (
    <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "#F3EAFF",
        }}
      >
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
        <Layout
          style={{
            justifyContent: "flex-end",
            backgroundColor: "#F3EAFF",
            flexDirection: "column",
          }}
        ></Layout>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

UserComments.propTypes = {
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
