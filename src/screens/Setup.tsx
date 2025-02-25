import React, { useState, useEffect } from "react";
import { View } from "react-native";
import {
  Card,
  Text,
  Button,
  Input,
  Select,
  SelectItem,
} from "@ui-kitten/components";
import RNPickerSelect from "react-native-picker-select";
import { ScrollView } from "react-native-gesture-handler";
import * as Analytics from "expo-firebase-analytics";
import { addUser, setUserGroups, getGroups } from "../utils/FirebaseUtils";
import screens from "../constants/screenNames";
import { stressOptions } from "../constants/community";
import SetupStyles from "../StyleSheets/SetupStyles";
import { Slider, YellowBox, FlatList } from "react-native";
import SurveyGroupItem from "../components/SurveyGroupItem";

export default function SetupSurvey({ navigation, route }) {
  // Ignore Firebase timer issues
  YellowBox.ignoreWarnings(["Setting a timer"]);
  console.ignoredYellowBox = ["Setting a timer"];

  // initial state
  const initialState = {
    username: "",
    val1: 5,
    val2: 5,
    val3: 5,
  };
  const [color, setColor] = useState("");
  const [userName, setUserName] = useState("");
  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [selectedIndexOne, setSelectedIndexOne] = useState([]);
  const [selectedIndexTwo, setSelectedIndexTwo] = useState([]);
  const [groupOptions, setGroupOptions] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    Analytics.setCurrentScreen("Setup");
  }, []);

  useEffect(() => {
    getGroups()
      .then((querySnapshot) => {
        const options = [];
        querySnapshot.forEach((doc) => {
          options.push({
            id: doc.id,
            title: doc.data().title,
            description: doc.data().description,
            imageURL: doc.data().imageURL,
          });
        });
        setGroupOptions(options);
        console.log("options: " + options);
      })
      .catch(() => navigation.navigate(screens.error));

    // will use this to create 3 random letters
    var num1 = Math.floor(Math.random() * 900 + 100).toString(10); // to ensure 3 digits
    var num2 = Math.floor(Math.random() * 900 + 100).toString(10); // to ensure 3 digits
    var characters = "abcdefghijklmnopqrstuvwxyz";
    var rand_str = "";
    for (var i = 0; i < 3; i++) {
      rand_str += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    setUserName(num1 + rand_str + num2);
  }, []);

  const renderOption = (group) => (
    <SelectItem title={group.title} key={group.id} />
  );

  const groupOneDisplayValues = selectedIndexOne.map((index) => {
    return stressOptions[index.row].title;
  });

  const groupTwoDisplayValues = selectedIndexTwo.map((index) => {
    return groupOptions[index.row].title;
  });

  const makeArray = (groupData, selectedIndex) => {
    var causes = [];
    selectedIndex.forEach((index) => {
      if (index != undefined) {
        causes.push(groupData[index.row]);
      }
    });
    return causes;
  };

  function handleEventChange(e, name) {
    setValues({ ...values, [name]: e.nativeEvent.text });
  }

  const allUserInformation = () => {
    // will use this to create user entry in db
    return {
      name: userName,
      color: color,
      support: values["val1"],
      voice: values["val2"],
      consider: values["val3"],
      stress: makeArray(stressOptions, selectedIndexOne),
      groups: makeArray(
        groupOptions.map((opt) => opt.id),
        selectedIndexTwo
      ),
    };
  };

  var isEnabled =
    selectedIndexOne.length >= 2 &&
    selectedIndexTwo.length >= 3 &&
    color.length > 0;

  const buttonText = !loading ? "Next" : "Loading...";

  return (
    <View style={SetupStyles.container}>
      <ScrollView>
        <View style={SetupStyles.header}>
          <Text category="h5">User Survey</Text>
        </View>
        <Card style={SetupStyles.card}>
          <Text style={SetupStyles.question}>Please select a color to represent your user profile:</Text>
          <RNPickerSelect
            style={SetupStyles}
            onValueChange={(value) => setColor(value)}
            items={[
              { label: "Kare Purple", value: "karePurple" },
              { label: "Fushia Purple", value: "fushiaPurple" },
              { label: "Red", value: "red" },
              { label: "Pink", value: "pink" },
              { label: "Orange", value: "orange" },
              { label: "Maize", value: "maize" },
              { label: "Blue", value: "blue" },
              { label: "Sky Blue", value: "skyBlue" },
              { label: "Mint Green", value: "mintGreen" },
              { label: "Forest Green", value: "forestGreen" },
              { label: "Black", value: "black" },
            ]}
          />
          <Text>Your random username will be {userName}</Text>
        </Card>
        <Card style={SetupStyles.card}>
          <Text style={SetupStyles.question}>
            How supported do you currently feel?
          </Text>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ paddingTop: 8 }}>Alone</Text>
            <Slider
              style={{ width: 200, height: 40 }}
              minimumValue={0}
              maximumValue={10}
              minimumTrackTintColor="#000000"
              maximumTrackTintColor="#000000"
              onSlidingComplete={(e) => {
                setValues({ ...values, ["val1"]: Math.floor(e) });
                //console.log(values);
              }}
            />
            <Text style={{ paddingTop: 8 }}>Supported</Text>
          </View>
        </Card>

        <Card style={SetupStyles.card}>
          <Text style={SetupStyles.question}>
            No matter what I am facing, I have somewhere to voice my concerns
          </Text>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ paddingTop: 8 }}>Disagree</Text>
            <Slider
              style={{ width: 200, height: 40 }}
              minimumValue={0}
              maximumValue={10}
              minimumTrackTintColor="#000000"
              maximumTrackTintColor="#000000"
              onSlidingComplete={(e) => {
                setValues({ ...values, ["val2"]: Math.floor(e) });
              }}
            />
            <Text style={{ paddingTop: 8 }}>Agree</Text>
          </View>
        </Card>
        <Card style={SetupStyles.card}>
          <Text style={SetupStyles.question}>I consider myself </Text>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ paddingTop: 8 }}>Introverted</Text>
            <Slider
              style={{ width: 165, height: 40 }}
              minimumValue={0}
              maximumValue={10}
              minimumTrackTintColor="#000000"
              maximumTrackTintColor="#000000"
              onSlidingComplete={(e) => {
                setValues({ ...values, ["val3"]: Math.floor(e) });
                //console.log(values);
              }}
            />
            <Text style={{ paddingTop: 8 }}>Extroverted</Text>
          </View>
        </Card>
        <Card style={SetupStyles.card}>
          <Text style={SetupStyles.question}>
            What are the leading causes of stress? Please select TWO 
            that most impact you. This information will remain confidential.
          </Text>
          <Select
            multiSelect={true}
            selectedIndex={selectedIndexOne}
            value={groupOneDisplayValues.join(", ")}
            onSelect={(index) => {
              setSelectedIndexOne(index);
            }}
            placeholder="Select TWO or more"
            caption={`Select ${
              selectedIndexOne.length < 2 ? 2 - selectedIndexOne.length : "any"
            } more`}
          >
            {stressOptions.map(renderOption)}
          </Select>
        </Card>
        <Card style={SetupStyles.card}>
          <Text style={SetupStyles.question}>
            Which communities within Kare would you like to join? 
            Please choose at least 3 communities.
          </Text>
          <FlatList
            data={groupOptions}
            renderItem={({ item }) => (
              <SurveyGroupItem
                title={item.title}
                image={item.imageURL}
                description={item.description}
                text={item.text}
                groupId={item.id}
              />
            )}
            keyExtractor={(item) => item.id}
          />
          <Select
            multiSelect={true}
            selectedIndex={selectedIndexTwo}
            value={groupTwoDisplayValues.join(", ")}
            onSelect={(index) => {
              setSelectedIndexTwo(index);
            }}
            placeholder="Select THREE or more"
            caption={`Select ${
              selectedIndexTwo.length < 3 ? 3 - selectedIndexTwo.length : "any"
            } more`}
          >
            {groupOptions.map(renderOption)}
          </Select>
        </Card>

        <Button
          onPress={() => {
            setLoading(!loading);
            try {
              addUser(route.params.email, route.params.password)
                .then(() => {
                  console.log("User account created & signed in!");
                  setUserGroups(allUserInformation()); // this will be subbed for creating the linked user db entry
                  Analytics.logEvent("SetupCompleted", {
                    name: "setup",
                    screen: "Setup",
                    purpose: "Join the Kare community",
                  });
                })
                .catch((error) => {
                  if (error.code === "auth/email-already-in-use") {
                    console.log("That email address is already in use!");
                  }

                  if (error.code === "auth/invalid-email") {
                    console.log("That email address is invalid!");
                  }

                  email.error = error.message;
                  setVisible(true);
                  return;
                });
              setLoading(!loading);
            } catch (err) {
              console.log(err); // in this case we just log it
              navigation.navigate(screens.error);
            }
          }}
          disabled={!((isEnabled && !loading) || (!isEnabled && loading))}
        >
          {buttonText}
        </Button>
        {/*
        <Button
          onPress={() => {
            navigation.navigate(screens.home);
          }}
          style={SetupStyles.button}
        >
          Go to Home debug
        </Button>
        <Button
          onPress={() => {
            navigation.navigate(screens.verifyEmail);
          }}
          style={{
            borderColor: "#5505BA",
            backgroundColor: "#5505BA",
          }}
        >
          Go to Verify Email debug
        </Button>*/}
      </ScrollView>
    </View>
  );
}
