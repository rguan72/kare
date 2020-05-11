import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  Image,
  TextInput,
  SectionList,
} from "react-native";
import PropTypes from "prop-types";
import {
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Layout, Button, Input, Text } from "@ui-kitten/components";
import ListItem from "../components/ListItem";
import {
  addComment,
  watchComments,
  reportComment,
} from "../utils/FirebaseUtils";
import { WOMEN } from "../../Images";
import ThreadStyles from "../StyleSheets/ThreadStyles";
import screens from "../constants/screenNames";
import PureImage from "../components/PureImage";

export default function Thread({ route, navigation }) {
  const { userId, title, description, groupId, image } = route.params;

  const GroupTitle = React.memo(() => {
    return (
      <Layout style={ThreadStyles.header}>
        {/* text box */}
        <Layout style={ThreadStyles.headerTextBox}>
          <Text category='h5'> {title} </Text>
          <Text style={{ marginRight: 10 }}> {description}</Text>
        </Layout>
        {/* image box */}
        <Layout style={{ backgroundColor: "#F3EAFF", maxHeight: 100 }}>
          <PureImage
            source={{ uri: image }}
            style={ThreadStyles.icon}
            resizeMode='cover'
          />
        </Layout>
      </Layout>
    );
  });

  const SectionListView = () => {
    const [comments, setComments] = useState([]);
    const [commentStructure, setCommentStructure] = useState([]);

    useEffect(() => {
      const unsubscribe = watchComments(setComments, groupId);
      return () => unsubscribe();
    }, []);

    useEffect(() => {
      setCommentStructure([
        { title: "Most Recent", data: comments.slice(0, 3) },
        { title: "Older", data: comments.slice(4) },
      ]);
    }, [comments]);

    return (
      <SectionList
        sections={commentStructure}
        ListHeaderComponent={GroupTitle}
        renderItem={({ item }) => {
          const date =
            item && item.timestamp
              ? item.timestamp.toDate().toLocaleDateString()
              : "";
          return (
            <ListItem
              userId={item.userId}
              text={item.text}
              onReply={() => {
                navigation.navigate(screens.replies, {
                  commenterId: item.userId,
                  comment: item.text,
                  commentId: item.id,
                  date: date,
                });
              }}
              onReport={() => reportComment(item.id)}
              date={date}
              numReplies={item.numReplies}
              showReplies='True'
            />
          );
        }}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={ThreadStyles.sectionHeader}> {title} </Text>
        )}
      />
    );
  };

  const ButtonLayout = () => {
    const [value, setValue] = useState("");

    return (
      <Layout style={ThreadStyles.commentBox}>
        <Input
          placeholder='Add comment'
          value={value}
          onChangeText={(e) => setValue(e)}
        />
        <Button
          onPress={() => {
            addComment(
              {
                userId: userId,
                text: value,
                reports: 0,
                show: true,
                numReplies: 0,
              },
              groupId
            );
            setValue("");
          }}
          style={ThreadStyles.submitButton}
          disabled={value === ""}
        >
          Submit
        </Button>
      </Layout>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={ThreadStyles.keyboardAvoidingView}
    >
      <SafeAreaView style={ThreadStyles.safeAreaView}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <React.Fragment>
            <SectionListView />
            <ButtonLayout />
          </React.Fragment>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

Thread.propTypes = {
  route: PropTypes.object.isRequired,
};
