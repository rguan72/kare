import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, FlatList } from "react-native";
import { Layout, Button, Input } from "@ui-kitten/components";
import ListItem from "../components/ListItem";
import {
  addComment,
  monitorComments,
  likeComment,
  dislikeComment
} from "../utils/FirebaseUtils";

export default function Thread() {
  const [comments, setComments] = useState([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    const unsubscribe = monitorComments(setComments);
    return () => unsubscribe();
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "#F0F0F0"
      }}
    >
      <FlatList
        data={comments}
        renderItem={({ item }) => (
          <ListItem
            user={item.user}
            text={item.text}
            likes={item.likes}
            onLike={() => likeComment(item.id)}
            onDislike={() => dislikeComment(item.id)}
          />
        )}
      />
      <Layout
        style={{
          justifyContent: "flex-end",
          flex: 1,
          backgroundColor: "#F0F0F0"
        }}
      >
        <Input
          placeholder="Add comment"
          value={value}
          onChangeText={setValue}
        />
        <Button
          onPress={() => {
            addComment({ user: "rich", text: value, likes: 0, show: true });
            setValue("");
          }}
          style={styles.mt0}
          disabled={value === ""}
        >
          Submit
        </Button>
      </Layout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  footer: {
    justifyContent: "flex-end",
    flex: 1
  },
  flex: {
    display: "flex"
  },
  mt0: {
    marginTop: 0
  }
});
