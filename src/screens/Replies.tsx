import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  FlatList} from "react-native";
import PropTypes from "prop-types";
import { KeyboardAvoidingView, View } from "react-native";
import { Layout, Button, Input, Text, Card } from "@ui-kitten/components";
import ListItem from "../components/ListItem";
import { addReply, getReplies, reportComment } from "../utils/FirebaseUtils";

export default function Replies({ route, navigation}) {
  const [replies, setReplies] = useState([]);
  const [value, setValue] = useState("");
  const { user, comment, commentId } = route.params;
  // hard coded for demo 
  const userId = "ztKIibvRJFjoz26pztO4";
  //const userId = user; // something like this would be done in reality

  useEffect(() => { // change to get replies
    getReplies(commentId).then(data => setReplies(data));
  }, [replies]);

  const ReplyParent = () => (
    <Layout style={[styles.mb, styles.bgColor, styles.mt]}>
      <Layout
        style={{
          backgroundColor: "#F3EAFF"
        }}
      >
        <Layout
          style={{
            flexDirection: "column",
            backgroundColor: "#F3EAFF"
          }}
        >
          <Card style={styles.card} >
            <View style={{ flexDirection: "row" }}>
                <View style={[styles.square, {/*add color*/marginRight: 5}]} /> 
                <Text style={styles.mb}>
                {" "} 
                {user}
                </Text> 
                <Text style={{ color: "rgba(0, 0, 0, 0.3)" }}>
                {" * "}
                {/*date*/}
                </Text>
            </View>
            {/* </View> */}
            <Text category="h6"> {comment} </Text>
        </Card>
        </Layout>
      </Layout>
    </Layout>
    
  );

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "#F3EAFF"
        }}
      >
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
                      commentId: item.id
                    })
                  }}
                numReplies={item.numReplies}
              />
            );
          }}
          keyExtractor={item => item.id}
        />
        <Layout
          style={{
            justifyContent: "flex-end",
            backgroundColor: "#F3EAFF",
            flexDirection: "column"
          }}
        >
          <Input
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
                numReplies: 0
              });
              setValue("");
            }}
            style={styles.mt0}
            disabled={value === ""}
          >
            Submit
          </Button>
        </Layout>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

Replies.propTypes = {
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
  },
  mt: {
    marginTop: 60
  },
  bgColor: {
    backgroundColor: "#F3EAFF"
  },
  card: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 20
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 44 / 2
  },
  square: {
    width: 20,
    height: 20,
    borderRadius: 5,
    overflow: "hidden"
  }
});
