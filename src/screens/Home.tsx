import React, { useState, useEffect, useImperativeHandle } from "react";
import {
  FlatList,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Button, Layout, Text, withStyles } from "@ui-kitten/components";
import GroupItem from "../components/GroupItem";
import PropTypes from "prop-types";
import { getGroupsById, getUser } from "../utils/FirebaseUtils";
import screens from "../constants/screenNames";
import firebase from "firebase/app";
import { Entypo } from "@expo/vector-icons";
import HomeStyles from "../StyleSheets/HomeStyles";
import SearchBar from "../components/SearchBar";
import { commentProcess } from "../utils/commentProcess";

interface Group {
  title: String;
  description: String;
  id: String;
}

export default function HomeScreen({ route, navigation }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = route.params;
  const [query, setQuery] = useState("");
  const [filteredGroups, setFilteredGroups] = useState([]);


  const onSignOut = () => {
    firebase
      .auth()
      .signOut()
      .catch(function (error) {
        console.log(error.message);
      });
  };

  useEffect(() => {
    setLoading(true);
    const unsubscribe = navigation.addListener("focus", () => {
      getUser(userId).then((user) =>
        getGroupsById(user.groups).then((fetchedGroups) =>
          setGroups(fetchedGroups)
        )
      );
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (groups && groups.length > 0) {
      setLoading(false);
    }
  }, [groups]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const lowerCaseQuery = commentProcess(query);
      setFilteredGroups(
        groups.filter((group) => {
          return commentProcess(group["title"]).includes(lowerCaseQuery);
        })
      );
      setLoading(false);
    }, 500);  
  }, [query]);

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
      <SearchBar
        placeholder="Search for a community..."
        onChangeText={setQuery}
        value={query}
      />
      {loading ? (
        <ActivityIndicator
          size='large'
          style={{ flex: 1 }}
          color='#5505BA'
          animating={loading}
        />
      ) : query.length > 0 ? (
        <FlatList
          data={filteredGroups}
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
