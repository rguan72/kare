import React, { useState, useEffect } from "react";
import { FlatList, View } from "react-native";
import { Layout, Text, withStyles } from "@ui-kitten/components";
import GroupItem from "../components/GroupItem";
import { getCurrentUser } from "../utils/FirebaseUtils";
import { CommonActions } from "@react-navigation/native";
import { watchGroups, onAuthUserListener } from "../utils/FirebaseUtils";
import HomeStyles from "../StyleSheets/HomeStyles";

interface Group {
  title: String;
  description: String;
  id: String;
}

export default function HomeScreen({ navigation }) {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const unsubscribe = watchGroups(setGroups);
    return () => unsubscribe();
  }, []);

  // Testing only. Will be reworked with #7 login ui
  function navSignup() {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "SignupScreen" }],
      })
    );
  }

  function navVerifyEmail() {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Verify Email" }],
      })
    );
  }

  onAuthUserListener(() => console.log("at home"), navSignup, navVerifyEmail);

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
              navigation.navigate("Thread", {
                title: item.title,
                description: item.description,
              })
            }
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
