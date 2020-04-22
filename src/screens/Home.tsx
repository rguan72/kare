import React, { useState, useEffect, useImperativeHandle } from "react";
import { FlatList, View } from "react-native";
import { Button, Layout, Text, withStyles } from "@ui-kitten/components";
import GroupItem from "../components/GroupItem";
import PropTypes from "prop-types";
import { getGroupsById, getUser } from "../utils/FirebaseUtils";
import screens from "../constants/screenNames";
import firebase from "firebase/app";

import HomeStyles from "../StyleSheets/HomeStyles";

interface Group {
  title: String;
  description: String;
  id: String;
}

export default function HomeScreen({ route, navigation }) {
  const [groups, setGroups] = useState([]);
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
    getUser(userId)
      .then((user) => getGroupsById(user.groups))
      .then((fetchedGroups) => setGroups(fetchedGroups));
  }, []);

  return (
    <View style={HomeStyles.container}>
      <View style={HomeStyles.Heading}>
        <Text category='h5'>My Communities</Text>
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
