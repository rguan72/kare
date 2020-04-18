import React, { useState, useEffect } from "react";
import { FlatList, View } from "react-native";
import { Button, Layout, Text, withStyles } from "@ui-kitten/components";
import GroupItem from "../components/GroupItem";
import { getCurrentUser } from "../utils/FirebaseUtils";
import { CommonActions } from "@react-navigation/native";
import { watchGroups, authNav, AuthState } from "../utils/FirebaseUtils";
import screens from "../constants/screenNames";

import HomeStyles from "../StyleSheets/HomeStyles";

interface Group {
  title: String;
  description: String;
  id: String;
}

export default function HomeScreen({ navigation }) {
  const [groups, setGroups] = useState([]);

  const _onSignOut = () => {
    firebase.auth().signOut().then(function() {
      navigation.navigate(screens.login);
    }).catch(function(error) {
      console.log(error.message)
    });
  };

  useEffect(() => {
    const unsubscribe = watchGroups(setGroups);
    return () => unsubscribe();
  }, []);

  authNav(navigation, AuthState.loggedin);

  return (
    <View style={HomeStyles.container}>
      <View style={HomeStyles.Heading}>
        <Text category="h5">My Communities</Text>
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
                title: item.title,
                description: item.description,
              })
            }
          />
        )}
        keyExtractor={(item) => item.id}
      />
      <Button onPress={_onSignOut} style={HomeStyles.SignOut}>
        Sign Out
      </Button>
    </View>
  );
}
