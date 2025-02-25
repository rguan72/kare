import React, { useState, useEffect } from "react";
import { FlatList, View, ActivityIndicator } from "react-native";
import { getGroupsById, getUser } from "../utils/FirebaseUtils";
import UserGroupItem from "../components/UserGroupItem";
import screens from "../constants/screenNames";
import { Card, Button, Text, Select, SelectItem } from "@ui-kitten/components";
import { getGroups, addGroupsToUser } from "../utils/FirebaseUtils";
import * as Analytics from "expo-firebase-analytics";

import HomeStyles from "../StyleSheets/HomeStyles";
import SetupStyles from "../StyleSheets/SetupStyles";

import NUM_GROUPS from "../constants/numberGroups";

export default function ManageGroups({ route, navigation }) {
  const [groups, setGroups] = useState([]);
  const { userId } = route.params;
  const [selectedIndexTwo, setSelectedIndexTwo] = useState([]);
  const [groupOptions, setGroupOptions] = useState([]);
  const [reload, setReload] = useState(false);

  const [loading, setLoading] = useState(true);

  const groupTwoDisplayValues = selectedIndexTwo.map((index) => {
    return groupOptions[index.row].title;
  });

  const renderOption = (group) => (
    <SelectItem title={group.title} key={group.id} />
  );

  useEffect(() => {
    Analytics.setCurrentScreen("ManageGroups");
  }, []);

  useEffect(() => {
    setLoading(true);
    getUser(userId)
      .then((user) => getGroupsById(user.groups))
      .then((fetchedGroups) => setGroups(fetchedGroups));
  }, [reload]);

  useEffect(() => {
    getGroups()
      .then((querySnapshot) => {
        const options = [];
        querySnapshot.forEach((doc) => {
          if (
            groups.filter((group) => {
              return group.title == doc.data().title;
            }).length == 0
          ) {
            options.push({ id: doc.id, title: doc.data().title });
          }
        });
        setGroupOptions(options);
      })
      .catch(() => navigation.navigate(screens.error));
  }, [groups]);

  useEffect(() => {
    if (groups.length > 0) {
      setLoading(false);
    }
  }, [groups]);

  const makeArray = (groupData, selectedIndex) => {
    var causes = [];
    selectedIndex.forEach((index) => {
      if (index != undefined) {
        causes.push(groupData[index.row]);
      }
    });
    return causes;
  };

  const onPress = () => {
    const newGroups = makeArray(
      groupOptions.map((opt) => opt.id),
      selectedIndexTwo
    );
    addGroupsToUser(newGroups);
    setSelectedIndexTwo([]);
    setReload(!reload);
    Analytics.logEvent("GroupJoined", {
      name: "groups",
      screen: "ManageGroups",
      purpose: "Joins a group for user",
    });
  };

  const onCancel = () => {
    setReload(!reload);
  };

  return (
    <View style={HomeStyles.container}>
      <View style={[HomeStyles.Heading, { marginBottom: 10 }]}>
        <Text category='h6'>Manage Communities</Text>
      </View>
      {loading ? (
        <ActivityIndicator
          size="large"
          style={{ flex: 1 }}
          color="#5505BA"
          animating={loading}
        />
      ) : (
        <React.Fragment>
          <FlatList
            data={groups}
            renderItem={({ item }) => (
              <UserGroupItem
                title={item.title}
                image={item.imageURL}
                description={item.description}
                onCancel={onCancel}
                groupId={item.id}
                num_groups={groups.length}
                userId={userId}
              />
            )}
            keyExtractor={(item) => item.id}
          />
          {!(groups.length < NUM_GROUPS) ? (
            <Text></Text>
          ) : (
            <Card style={SetupStyles.card}>
              <Text category="h6">Would you like to join any new groups?</Text>
              <Select
                multiSelect={true}
                selectedIndex={selectedIndexTwo}
                value={groupTwoDisplayValues.join(", ")}
                onSelect={(index) => {
                  setSelectedIndexTwo(index);
                }}
              >
                {groupOptions.map(renderOption)}
              </Select>
              <Button onPress={onPress} disabled={selectedIndexTwo.length == 0}>
                Join!
              </Button>
            </Card>
          )}
        </React.Fragment>
      )}
    </View>
  );
}
