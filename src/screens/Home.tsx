import React, { useState, useEffect, useContext } from "react";
import {
  FlatList,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import firebase from "firebase/app";
import GroupItem from "../components/GroupItem";
import PropTypes from "prop-types";
import * as Analytics from "expo-firebase-analytics";
import { Notifications } from "expo";
import { Entypo } from "@expo/vector-icons";
import { Button, Text } from "@ui-kitten/components";
import {
  getGroupsById,
  getCommentsSince,
  onGroupOpen,
} from "../utils/FirebaseUtils";
import { registerForPushNotificationsAsync } from "../utils/NotificationUtils";
import screens from "../constants/screenNames";
import HomeStyles from "../StyleSheets/HomeStyles";
import HomeSearchBar from "../components/HomeSearchBar";
import { commentProcess } from "../utils/commentProcess";
import { UserContext } from "../UserContext";

interface Group {
  title: String;
  description: String;
  id: String;
}

export default function HomeScreen({ route, navigation }) {
  const [currentUser, setCurrentUser] = useState({});
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = route.params;
  const [query, setQuery] = useState("");
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [groupData, setGroupData] = useState({});

  const { userState, dispatch } = useContext(UserContext);

  const onSignOut = () => {
    firebase
      .auth()
      .signOut()
      .catch(function (error) {
        console.log(error.message);
      });
  };

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

  useEffect(() => {
    Analytics.setCurrentScreen("Home");
  }, []);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = navigation.addListener("focus", () => {
      setLoading(true);
      getGroupsById(userState.groups).then((fetchedGroups) => {
        setGroups(fetchedGroups);
        Analytics.setUserProperty(
          "communitiesJoined",
          fetchedGroups.length.toString()
        );
        setLoading(false);
      });
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!currentUser.notificationId) {
      registerForPushNotificationsAsync(userId);
    }
    const _notificationSubscription = Notifications.addListener(
      handleNotification
    );
  }, []);

  useEffect(() => {
    getCommentsSince(userId).then((res) => setGroupData(res));
  }, [groups]);

  useEffect(() => {
    if (groups && groups.length > 0) {
      setLoading(false);
    }
  }, [groups]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const lowerCaseQuery = commentProcess(query);
      setFilteredGroups(
        groups.filter((group) => {
          return commentProcess(group["title"]).includes(lowerCaseQuery);
        })
      );
      setLoading(false);
    }, 500);
  }, [query]);

  return (
    <View style={HomeStyles.container}>
      <View style={HomeStyles.Heading}>
        <Text category='h5' style={{ alignSelf: "center" }}>
          My Communities
        </Text>
        <TouchableOpacity
          style={{ position: "absolute", right: 10 }}
          onPress={() =>
            navigation.navigate(screens.manage, {
              userId: userId,
            })
          }
        >
          <Entypo name='dots-three-horizontal' size={20} />
        </TouchableOpacity>
      </View>
      <HomeSearchBar
        placeholder='Search for a community...'
        onChangeText={setQuery}
        value={query}
      />
      {loading ? (
        <ActivityIndicator
          size='large'
          style={{ flex: 1 }}
          color='#5505BA'
          animating={loading}
        />
      ) : query.length > 0 ? (
        <FlatList
          data={filteredGroups}
          renderItem={({ item }) => (
            <GroupItem
              title={item.title}
              image={item.imageURL}
              description={item.description}
              onPress={() => {
                navigation.navigate(screens.thread, {
                  userId: userId,
                  title: item.title,
                  description: item.description,
                  groupId: item.id,
                  image: item.imageURL,
                  num_members: item.num_members,
                });
                onGroupOpen(item.id, userId);
              }}
              commentsSince={groupData[item.id]}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <FlatList
          data={groups}
          renderItem={({ item }) => (
            <GroupItem
              title={item.title}
              image={item.imageURL}
              description={item.description}
              onPress={() => {
                navigation.navigate(screens.thread, {
                  userId: userId,
                  title: item.title,
                  description: item.description,
                  groupId: item.id,
                  image: item.imageURL,
                  num_members: item.num_members,
                });
                Analytics.logEvent("openGroup", {
                  name: "groupOpen",
                  screen: "Home",
                  purpose: "Open a group to view contents",
                });
                onGroupOpen(item.id, userId);
              }}
              commentsSince={groupData[item.id]}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      )}
      <Button style={HomeStyles.SignOut} onPress={onSignOut}>
        Sign Out
      </Button>
    </View>
  );
}

HomeScreen.propTypes = {
  route: PropTypes.object.isRequired,
};
