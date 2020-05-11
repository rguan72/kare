import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
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
  getUser,
} from "../utils/FirebaseUtils";
import ThreadStyles from "../StyleSheets/ThreadStyles";
import screens from "../constants/screenNames";
import PureImage from "../components/PureImage";
import { EvilIcons } from "@expo/vector-icons";
import SearchBar from "../components/SearchBar";

export default function Thread({ route, navigation }) {
  const {
    userId,
    title,
    description,
    groupId,
    image,
    num_members,
  } = route.params;

  const [user, setUser] = useState();

  useEffect(() => {
    getUser(userId).then((userData) => {
      setUser(userData);
    });
  }, []);

  const GroupTitle = React.memo(() => {
    return (
      <Layout style={ThreadStyles.header}>
        <Layout style={ThreadStyles.headerTextBox}>
          <Text category='h5'> {title} </Text>
          <Text style={{ marginTop: 2, marginRight: 10 }}> {description}</Text>
          <Text style={{ marginTop: 2 }}> {num_members} Members</Text>
        </Layout>
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

  const ListSearchView = () => {
    const [comments, setComments] = useState([]);
    const [commentStructure, setCommentStructure] = useState([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [filteredComments, setFilteredComments] = useState([]);

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
      <>
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
                  commenterName={item.commenterName}
                  color={item.color}
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
                  commenterName={item.commenterName}
                  color={item.color}
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
      </>
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
                color: user.color,
                commenterName: user.name,
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
            <ListSearchView />
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
