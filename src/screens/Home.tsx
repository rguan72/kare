import React, { useState, useEffect, useImperativeHandle } from "react";
import {
  FlatList,
  View,
  TouchableOpacity,
  Vibration,
  Platform,
} from "react-native";
import { Button, Layout, Text, withStyles } from "@ui-kitten/components";
import GroupItem from "../components/GroupItem";
import PropTypes from "prop-types";
import {
  getGroupsById,
  getUser,
  addNotifTokenToUser,
} from "../utils/FirebaseUtils";
import screens from "../constants/screenNames";
import firebase from "firebase/app";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import { Entypo } from "@expo/vector-icons";
import HomeStyles from "../StyleSheets/HomeStyles";

interface Group {
  title: String;
  description: String;
  id: String;
}

export default function HomeScreen({ route, navigation }) {
  const [groups, setGroups] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const { userId } = route.params;

  const onSignOut = () => {
    firebase
      .auth()
      .signOut()
      .catch(function (error) {
        console.log(error.message);
      });
  };

  const registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      const token = await Notifications.getExpoPushTokenAsync();
      // TODO add token to user in db
      console.log(`The exponent token for your device is ${token}`);
      addNotifTokenToUser(userId, token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.createChannelAndroidAsync("default", {
        name: "default",
        sound: true,
        priority: "max",
        vibrate: [0, 250, 250, 250],
      });
    }
  };

  const _handleNotification = (notification) => {
    const data = notification.data;
    console.log(
      `Notification is being handled and you will be redirected to ${data.comment} thread`
    );
    navigation.navigate(screens.replies, {
      commenterId: data.commenterId,
      comment: data.comment,
      commentId: data.commentId,
      date: data.date,
      userId: userId,
    });
  };

  useEffect(() => {
    registerForPushNotificationsAsync();
    const _notificationSubscription = Notifications.addListener(
      _handleNotification
    );
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getUser(userId)
        .then((user) => getGroupsById(user.groups))
        .then((fetchedGroups) => setGroups(fetchedGroups));
    });

    return unsubscribe;
  }, [navigation]);

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
