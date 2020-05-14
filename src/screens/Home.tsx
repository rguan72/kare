import React, { useState, useEffect } from "react";
import { FlatList, View, TouchableOpacity } from "react-native";
import firebase from "firebase/app";
import PropTypes from "prop-types";
import { Notifications } from "expo";
import { Entypo } from "@expo/vector-icons";
import { Button, Text } from "@ui-kitten/components";
import { getGroupsById, getUser } from "../utils/FirebaseUtils";
import { registerForPushNotificationsAsync } from "../utils/NotificationUtils";
import GroupItem from "../components/GroupItem";
import screens from "../constants/screenNames";
import HomeStyles from "../StyleSheets/HomeStyles";

interface Group {
  title: String;
  description: String;
  id: String;
}

export default function HomeScreen({ route, navigation }) {
  const [currentUser, setCurrentUser] = useState({});
  const [groups, setGroups] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const { userId } = route.params;

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getUser(userId).then((user) => {
        setCurrentUser(user);
        getGroupsById(user.groups).then((fetchedGroups) =>
          setGroups(fetchedGroups)
        );
      });
    });

    return unsubscribe;
  }, [refresh]);

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
    console.log(notification.data);
    navigation.navigate(screens.replies, {
      commenterId,
      comment,
      commentId,
      date,
      userId,
    });
  };

  useEffect(() => {
    if (!currentUser.notificationId) {
      registerForPushNotificationsAsync(userId);
    }
    const _notificationSubscription = Notifications.addListener(
      handleNotification
    );
  }, []);

  const handleNavigateBack = () => {
    setRefresh(!refresh);
  };

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
              onNavigateBack: handleNavigateBack,
            })
          }
        >
          <Entypo name='dots-three-horizontal' size={20} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={groups}
        renderItem={({ item }) => (
          <GroupItem
            title={item.title}
            image={item.imageURL}
            description={item.description}
            text={item.text}
            onPress={() =>
              navigation.navigate(screens.thread, {
                userId: userId,
                title: item.title,
                description: item.description,
                groupId: item.id,
                image: item.imageURL,
              })
            }
          />
        )}
        keyExtractor={(item) => item.id}
      />
      <Button onPress={onSignOut} style={HomeStyles.SignOut}>
        Sign Out
      </Button>
    </View>
  );
}

HomeScreen.propTypes = {
  route: PropTypes.object.isRequired,
};
