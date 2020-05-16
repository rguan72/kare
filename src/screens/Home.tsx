
import React, { useState, useEffect, useImperativeHandle } from "react";
import {
  FlatList,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import firebase from "firebase/app";
import { Button, Layout, Text, withStyles } from "@ui-kitten/components";
import GroupItem from "../components/GroupItem";
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
  const [loading, setLoading] = useState(true);
  const { userId } = route.params;

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
    }
                        }

  useEffect(() => {
    setLoading(true);
    const unsubscribe = navigation.addListener("focus", () => {
      getUser(userId).then((user) =>
        getGroupsById(user.groups).then((fetchedGroups) =>
          setGroups(fetchedGroups)
        )
      );
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

  useEffect(() => {
    if (groups && groups.length > 0) {
      setLoading(false);
    }
  }, [groups]);

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
      {loading ? (
        <ActivityIndicator
          size='large'
          style={{ flex: 1 }}
          color='#5505BA'
          animating={loading}
        />
      ) : (
        <FlatList
          data={groups}
          renderItem={({ item }) => (
            <GroupItem
              title={item.title}
              image={item.imageURL}
              description={item.description}
              onPress={() =>
                navigation.navigate(screens.thread, {
                  userId: userId,
                  title: item.title,
                  description: item.description,
                  groupId: item.id,
                  image: item.imageURL,
                  num_members: item.num_members,
                })
              }
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
