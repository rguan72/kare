import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, FlatList } from "react-native";
import PropTypes from "prop-types";
import {
  Layout,
  Button,
  Input,
  Card,
  CardHeader,
  Text
} from "@ui-kitten/components";
import ListItem from "../components/ListItem";
import {
  addComment,
  monitorComments,
  reportComment
} from "../utils/FirebaseUtils";

export default function Thread({ route }) {
  const [comments, setComments] = useState([]);
  const [value, setValue] = useState("");
  const { title, description } = route.params;
  // hard coded for demo
  const userId = "AoC3Bt3MgTlVm75ejvkd";
  useEffect(() => {
    const unsubscribe = monitorComments(setComments);
    return () => unsubscribe();
  });

  const Header = () => <CardHeader title={title} />;
  const GroupTitle = () => (
    <Layout style={styles.mb}>
      <Card header={Header}>
        <Text>{description}</Text>
      </Card>
    </Layout>
  );

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
        ListHeaderComponent={GroupTitle}
        renderItem={({ item }) => (
          <ListItem
            userId={item.userId}
            text={item.text}
            onReport={() => reportComment(item.id)}
          />
        )}
        keyExtractor={item => item.id}
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
            addComment({ userId: userId, text: value, reports: 0, show: true });
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

Thread.propTypes = {
  route: PropTypes.object.isRequired
};

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
  },
  mb: {
    marginBottom: 20
  }
});
