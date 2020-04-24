import React, { useState, useEffect, useImperativeHandle } from "react";
import { FlatList, View } from "react-native";
import { Button, Layout, Text, withStyles } from "@ui-kitten/components";
import GroupItem from "../components/GroupItem";
import PropTypes from "prop-types";
import { getGroupsById, getUser } from "../utils/FirebaseUtils";
import screens from "../constants/screenNames";
import firebase from "firebase/app";
import { NavigationEvents } from "react-navigation";
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
        <Text category='h5'>My Communities</Text>
        <Text
          style={{ alignSelf: "flex-end" }}
          onPress={() =>
            navigation.navigate(screens.manage, {
              userId: userId,
              onNavigateBack: handleNavigateBack,
            })
          }
        >
          Manage Communities
        </Text>
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
