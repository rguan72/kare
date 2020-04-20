import React, { useState, useEffect } from "react";
import { FlatList, View } from "react-native";
import { Button, Layout, Text, withStyles } from "@ui-kitten/components";
import GroupItem from "../components/GroupItem";
import { getCurrentUser } from "../utils/FirebaseUtils";
import { CommonActions } from "@react-navigation/native";
import { watchGroups, authNav, AuthState } from "../utils/FirebaseUtils";
import screens from "../constants/screenNames";
import firebase from "firebase/app";

import HomeStyles from "../StyleSheets/HomeStyles";

interface Group {
  title: String;
  description: String;
  id: String;
}

export default function HomeScreen({ navigation }) {
  const [groups, setGroups] = useState([]);

  const onSignOut = () => {
    firebase
      .auth()
      .signOut()
      .catch(function (error) {
        console.log(error.message);
      });
  };

  useEffect(() => {
    const unsubscribe = watchGroups(setGroups);
    return () => unsubscribe();
  }, []);

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
      <Button onPress={onSignOut} style={HomeStyles.SignOut}>
        Sign Out
      </Button>
    </View>
  );
}
