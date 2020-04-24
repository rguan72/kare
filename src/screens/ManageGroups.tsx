import React, { useState, useEffect } from "react";
import { FlatList, View, Text } from "react-native";
import { getGroupsById, getUser } from "../utils/FirebaseUtils";
import UserGroupItem from "../components/UserGroupItem";
import screens from "../constants/screenNames";
import { Card, Button, Input, Select, SelectItem } from "@ui-kitten/components";
import { getGroups, addGroupsToUser } from "../utils/FirebaseUtils";

import HomeStyles from "../StyleSheets/HomeStyles";
import SetupStyles from "../StyleSheets/SetupStyles";

export default function ManageGroups({ route, navigation }) {
  const [groups, setGroups] = useState([]);
  const { userId } = route.params;
  const [selectedIndexTwo, setSelectedIndexTwo] = useState([]);
  const [groupOptions, setGroupOptions] = useState([]);
  const [reload, setReload] = useState(false);

  const groupTwoDisplayValues = selectedIndexTwo.map((index) => {
    return groupOptions[index.row].title;
  });

  const renderOption = (group) => (
    <SelectItem title={group.title} key={group.id} />
  );

  useEffect(() => {
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
        console.log("options: " + options);
      })
      .catch(() => navigation.navigate(screens.error));
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
  };

  const onCancel = () => {
    setReload(!reload);
  };

  return (
    <View style={HomeStyles.container}>
      <View style={HomeStyles.Heading}>
        <Text category='h5'>Edit Communities</Text>
      </View>
      <FlatList
        data={groups}
        renderItem={({ item }) => (
          <UserGroupItem
            title={item.title}
            image={item.imageURL}
            description={item.description}
            text={item.text}
            onCancel={onCancel}
            groupId={item.id}
          />
        )}
        keyExtractor={(item) => item.id}
      />
      <Card style={SetupStyles.card}>
        <Text category='h6'>Would you like to join any new groups?</Text>
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
        <Button style={{ backgroundColor: "#5505BA" }} onPress={onPress}>
          Join!
        </Button>
      </Card>
    </View>
  );
}
