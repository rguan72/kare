import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  Image,
  SectionList,
  ActivityIndicator,
} from "react-native";
import PropTypes from "prop-types";
import {
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Layout, Button, Input, Text, Icon } from "@ui-kitten/components";
import ListItem from "../components/ListItem";
import {
  addComment,
  watchComments,
  reportComment,
} from "../utils/FirebaseUtils";
import ThreadStyles from "../StyleSheets/ThreadStyles";
import screens from "../constants/screenNames";
import { EvilIcons } from "@expo/vector-icons";
import SearchBar from "../components/SearchBar";

export default function Thread({ route, navigation }) {
  const [comments, setComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [commentStructure, setCommentStructure] = useState([]);
  const [value, setValue] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    userId,
    title,
    description,
    groupId,
    image,
    num_members,
  } = route.params;

  useEffect(() => {
    const unsubscribe = watchComments(setComments, groupId);

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setCommentStructure([
      { title: "Most Recent", data: comments.slice(0, 3) },
      { title: "Older", data: comments.slice(3) },
    ]);
  }, [comments]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const lowerCaseQuery = query.toLowerCase();
      setFilteredComments(
        comments.filter((comment) => {
          return comment["text"].toLowerCase().includes(lowerCaseQuery);
        })
      );
      setLoading(false);
    }, 500);
  }, [query]);

  const GroupTitle = () => (
    <>
      <Layout style={ThreadStyles.header}>
        {/* text box */}
        <Layout style={ThreadStyles.headerTextBox}>
          <Text category='h5'> {title} </Text>
          <Text style={{ marginTop: 2, marginRight: 10 }}> {description}</Text>
          <Text style={{ marginTop: 2 }}> {num_members} Members</Text>
        </Layout>
        {/* image box */}
        <Layout style={{ backgroundColor: "#F3EAFF", maxHeight: 100 }}>
          <Image source={{ uri: image }} style={ThreadStyles.icon} />
        </Layout>
      </Layout>
    </>
  );

  const renderIcon = (props) => (
    <TouchableWithoutFeedback>
      {!query ? (
        <EvilIcons name='search' size={25} />
      ) : loading ? (
        <ActivityIndicator size={25} color='#8566AA' />
      ) : (
        <Text></Text>
      )}
    </TouchableWithoutFeedback>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={ThreadStyles.keyboardAvoidingView}
    >
      <SafeAreaView style={ThreadStyles.safeAreaView}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <React.Fragment>
            <SearchBar
              placeholder='Search for a comment...'
              onChangeText={setQuery}
              value={query}
              accessoryRight={renderIcon}
            />
            {query.length > 0 ? (
              <FlatList
                style={{ marginTop: 5 }}
                data={filteredComments}
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
              />
            ) : (
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
                stickySectionHeadersEnabled={false}
              />
            )}
            <Layout style={ThreadStyles.commentBox}>
              <Input
                placeholder='Add comment'
                value={value}
                onChangeText={setValue}
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
          </React.Fragment>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

Thread.propTypes = {
  route: PropTypes.object.isRequired,
};
