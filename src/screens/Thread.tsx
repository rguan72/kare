import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native";
import PropTypes from "prop-types";
import {
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
<<<<<<< HEAD
import { Layout, Button, Input, Text, Icon } from "@ui-kitten/components";
import ListItem from "../components/ListItem";
import {
  addComment,
  watchComments,
  reportComment,
  getUser,
  makeGroupConnectors,
  incrementGroupConnectors,
} from "../utils/FirebaseUtils";
=======
import ListSearchView from "../components/ListSearchView";
import ButtonLayout from "../components/ButtonLayout";
import { getUser } from "../utils/FirebaseUtils";
>>>>>>> 592e9e2a510a4dda6c8e663ab0803fdbfba5c08d
import ThreadStyles from "../StyleSheets/ThreadStyles";
import ReportDialogue from "../components/ReportDialogue";

export default function Thread({ route, navigation }) {
  const {
    userId,
    title,
    description,
    groupId,
    image,
    num_members,
  } = route.params;
  const [showReportDialogue, setShowReportDialogue] = useState(false);
  const [reporterID, setReporterID] = useState("");
  const [reporteeID, setReporteeID] = useState("");
  const [reportedComment, setReportedComment] = useState("");
  const [reportedCommentID, setReportedCommentID] = useState("");

  const [user, setUser] = useState();
  const [commentsLoading, setCommentsLoading] = useState(true);

  useEffect(() => {
    getUser(userId).then((userData) => {
      setUser(userData);
    });
  }, []);

<<<<<<< HEAD
  const GroupTitle = React.memo(() => {
    return (
      <Layout style={ThreadStyles.header}>
        <Layout style={ThreadStyles.headerTextBox}>
          <Text category='h5'>{title}</Text>
          <Text style={{ marginTop: 2, marginRight: 10 }}>{description}</Text>
          <Text style={{ marginTop: 2 }}>{num_members} Members</Text>
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
      //setCommentsLoading(true);
      const unsubscribe = watchComments(
        setComments,
        groupId,
        setCommentsLoading
      );
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
        const lowerCaseQuery = commentProcess(query);
        setFilteredComments(
          comments.filter((comment) => {
            return commentProcess(comment["text"]).includes(lowerCaseQuery);
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
        {commentsLoading ? (
          <ActivityIndicator
            size='large'
            style={{ flex: 1 }}
            color='#5505BA'
            animating={commentsLoading}
          />
        ) : query.length > 0 ? (
          <FlatList
            style={{ marginTop: 5 }}
            data={filteredComments}
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
              <Text style={ThreadStyles.sectionHeader}>{title}</Text>
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
          multiline
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
=======
  const handleReportDialogue = (
    reporterID: string,
    reporteeID: string,
    comment: string,
    commentId: string
  ) => {
    setReporterID(reporterID);
    setReporteeID(reporteeID);
    setReportedComment(comment);
    setReportedCommentID(commentId);
    closeReportDialogue();
  };
  const closeReportDialogue = () => {
    setShowReportDialogue(!showReportDialogue);
>>>>>>> 592e9e2a510a4dda6c8e663ab0803fdbfba5c08d
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={ThreadStyles.keyboardAvoidingView}
    >
      <SafeAreaView style={ThreadStyles.safeAreaView}>
        <ReportDialogue
          reporterID={reporterID}
          reporteeID={reporteeID}
          comment={reportedComment}
          commentRef={reportedCommentID}
          showReportDialogue_={showReportDialogue}
          closeReportDialogue_={closeReportDialogue}
        />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <React.Fragment>
            <ListSearchView
              userId={userId}
              groupId={groupId}
              commentsLoading={commentsLoading}
              setCommentsLoading={setCommentsLoading}
              navigation={navigation}
              handleReportDialogue={handleReportDialogue}
              title={title}
              description={description}
              image={image}
              num_members={num_members}
            />
            <ButtonLayout userId={userId} user={user} groupId={groupId} />
          </React.Fragment>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

Thread.propTypes = {
  route: PropTypes.object.isRequired,
};
