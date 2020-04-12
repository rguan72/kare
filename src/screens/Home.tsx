import React, { useState, useEffect } from "react";
import { StyleSheet, FlatList, View } from "react-native";
import { Layout, Text, withStyles } from "@ui-kitten/components";
import GroupItem from "../components/GroupItem";
import { getGroups } from "../utils/FirebaseUtils";

interface Group {
  title: String;
  description: String;
  id: String;
}

function HomeScreen({ navigation }) {
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    getGroups()
      .then((data) => setGroups(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <View style={{ marginTop: 30, backgroundColor: "#FFFDF4", flex: 1 }}>
      <View style={{ alignItems: "center", marginTop: 15 }}>
        <Text category='h5'>My Communities</Text>
      </View>
      <FlatList
        data={groups}
        renderItem={({ item }) => (
          <GroupItem
            title={item.title}
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

export default withStyles(HomeScreen, (theme) => ({
  light: {
    backgroundColor: theme["color-primary-100"],
  },
}));

const styles = StyleSheet.create({
  m: {
    margin: 20,
  },
});
