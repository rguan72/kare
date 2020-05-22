import React, { useState, useEffect } from "react";
import { FlatList, SectionList, ActivityIndicator } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import { Notifications } from "expo";
import { Text } from "@ui-kitten/components";
import ListItem from "./ListItem";
import SearchBar from "./SearchBar";
import GroupTitle from "./GroupTitle";
import { watchComments } from "../utils/FirebaseUtils";
import ThreadStyles from "../StyleSheets/ThreadStyles";
import screens from "../constants/screenNames";
import { EvilIcons } from "@expo/vector-icons";
import { commentProcess } from "../utils/commentProcess";

interface ListSearchViewProps {
  groupId: string;
  commentsLoading: boolean;
  setCommentsLoading: any;
  handleReportDialogue: (
    reporterID: string,
    reporteeID: string,
    comment: string,
    commentId: string
  ) => void;
  title: string;
  description: string;
  image: string;
  num_members: Number;
  navigation: any;
  userId: string;
}

export default function ListSearchView(props: ListSearchViewProps) {
  const {
    userId,
    groupId,
    commentsLoading,
    setCommentsLoading,
    navigation,
    handleReportDialogue,
    title,
    description,
    num_members,
    image,
  } = props;
  const [comments, setComments] = useState([]);
  const [commentStructure, setCommentStructure] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [filteredComments, setFilteredComments] = useState([]);

  useEffect(() => {
    //setCommentsLoading(true);
    const unsubscribe = watchComments(setComments, groupId, setCommentsLoading);
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

  useEffect(() => {
    const _notificationSubscription = Notifications.addListener(
      handleNotification
    );
    //setCommentsLoading(true);
    const unsubscribe = watchComments(setComments, groupId, setCommentsLoading);
    return () => unsubscribe();
  }, []);

  const handleNotification = (notification) => {
    const { commenterId, comment, commentId, date } = notification.data;

    navigation.navigate(screens.replies, {
      commenterId,
      comment,
      commentId,
      date,
      userId,
    });
  };

  const handleFollowing = (item) => {
    if (item && item.hasOwnProperty("followers")) {
      return Boolean(item.followers.find((userIdx) => userIdx === userId));
    } else {
      return false;
    }
  };

  const GroupTitleMemo = React.memo(() => (
    <GroupTitle
      title={title}
      description={description}
      num_members={num_members}
      image={image}
    />
  ));

  const renderIcon = () => (
    <TouchableWithoutFeedback>
      {!query ? (
        <EvilIcons name="search" size={25} />
      ) : loading ? (
        <ActivityIndicator size={25} color="#8566AA" />
      ) : (
        <Text></Text>
      )}
    </TouchableWithoutFeedback>
  );

  return (
    <>
      <SearchBar
        placeholder="Search for a comment..."
        onChangeText={setQuery}
        value={query}
        accessoryRight={renderIcon}
      />
      {commentsLoading ? (
        <ActivityIndicator
          size="large"
          style={{ flex: 1 }}
          color="#5505BA"
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
            const following = handleFollowing(item);
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
                onReport={() =>
                  handleReportDialogue(item.userId, userId, item.text, item.id)
                }
                date={date}
                numReplies={item.numReplies}
                showReplies
                commenterName={item.commenterName}
                color={item.color}
                following={following}
                userId={userId}
                commenterId={item.userId}
                commentId={item.id}
                setQuery={setQuery}
              />
            );
          }}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <SectionList
          sections={commentStructure}
          ListHeaderComponent={GroupTitleMemo}
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
            const following = handleFollowing(item);
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
                onReport={() =>
                  handleReportDialogue(item.userId, userId, item.text, item.id)
                }
                date={date}
                numReplies={item.numReplies}
                showReplies
                commenterName={item.commenterName}
                color={item.color}
                following={following}
                commentId={item.id}
                userId={userId}
                commenterId={item.userId}
                setQuery={setQuery}
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
}
