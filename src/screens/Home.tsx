import React, { useState, useEffect } from "react";
import { StyleSheet, FlatList } from "react-native";
import { Layout, Text } from "@ui-kitten/components";
import GroupItem from "../components/GroupItem";
import { getGroups } from "../utils/FirebaseUtils";

interface Group {
  title: String;
  description: String;
  id: String;
}

export default function HomeScreen({ navigation }) {
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    getGroups()
      .then(data => setGroups(data))
      .catch(err => console.log(err));
  }, []);

  return (
    <Layout style={{ backgroundColor: "#F0F0F0", marginTop: 30 }}>
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
                description: item.description
              })
            }
          />
        )}
        keyExtractor={item => item.id}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  m: {
    margin: 20
  }
});
