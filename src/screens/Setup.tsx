import React, { useState } from "react";
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
import {
  addUser,
  sendVerificationEmail,
  onAuthUserListener,
} from "../utils/FirebaseUtils";
import { getEmailExtension } from "../utils/Parse";
import whitelist from "../constants/emailWhitelist";
import { CommonActions } from "@react-navigation/native";
import { groupOptions, stressOptions } from "../constants/community";
import SetupStyles from "../StyleSheets/SetupStyles";
import { Slider } from "react-native";

export default function SetupSurvey({ navigation }) {
  // initial state
  const initialState = {
    username: "",
    email: "",
    val1: 5,
    val2: 5,
    val3: 5,
  };
  const [color, setColor] = useState("");
  const [userName, setUserName] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [selectedIndexOne, setSelectedIndexOne] = useState([]);
  const [selectedIndexTwo, setSelectedIndexTwo] = useState([]);

  const renderOption = (title) => <SelectItem title={title} key={title} />;

  const groupOneDisplayValues = selectedIndexOne.map((index) => {
    return stressOptions[index.row];
  });

  const groupTwoDisplayValues = selectedIndexTwo.map((index) => {
    return groupOptions[index.row];
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
      color: color,
      support: values["val1"],
      voice: values["val2"],
      consider: values["val3"],
      stress: makeArray(stressOptions, selectedIndexOne),
      groups: makeArray(groupOptions, selectedIndexTwo),
    };
  };

  var isEnabled =
    values["username"].length > 0 &&
    selectedIndexOne.length >= 2 &&
    selectedIndexTwo.length >= 3 &&
    color.length > 0 &&
    emailValid;

  const buttonText = !loading ? "Next" : "Loading...";

  // TODO #7 login screen ui
  function navHome() {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Home" }],
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

  onAuthUserListener(
    navHome,
    () => console.log("not signed in"),
    navVerifyEmail
  );

  return (
    <View style={SetupStyles.container}>
      <ScrollView>
        <View style={SetupStyles.header}>
          <Text category="h4">Setup Survey</Text>
        </View>
        <Card style={SetupStyles.card}>
          <Text category="h6">Select your favorite Color:</Text>
          <Text style={{ paddingTop: 2, paddingBottom: 2 }}>(required)</Text>
          <RNPickerSelect
            style={SetupStyles}
            onValueChange={(value) => setColor(value)}
            items={[
              { label: "Beige", value: "beige" },
              { label: "Red", value: "red" },
              { label: "Purple", value: "purple" },
              { label: "Blue", value: "blue" },
              { label: "Green", value: "green" },
            ]}
          />
        </Card>
        <Card style={SetupStyles.card}>
          <Text category="h6">What is your student email? </Text>
          <Text style={{ paddingTop: 2, paddingBottom: 2 }}>(required)</Text>
          <Input
            value={values["email"]}
            autoCapitalize="none"
            onChange={(e) => handleEventChange(e, "email")}
            onEndEditing={(e) => {
              const email = values["email"];
              setEmailValid(whitelist.includes(getEmailExtension(email)));
            }}
          />
          {!emailValid && <Text> Need valid .edu email to sign up </Text>}
        </Card>
        <Card style={SetupStyles.card}>
          <Text category="h6">What is your spirit animal? </Text>
          <Text style={{ paddingTop: 2, paddingBottom: 2 }}>(required)</Text>
          <Input
            value={values["username"]}
            onChange={(e) => handleEventChange(e, "username")}
            onEndEditing={(e) => {
              var num1 = Math.floor(Math.random() * 900 + 100).toString(10); // to ensure 3 digits
              var num2 = Math.floor(Math.random() * 900 + 100).toString(10); // to ensure 3 digits
              return setUserName(
                num1 + e.nativeEvent.text.trim().toLowerCase() + num2
              );
            }}
          />
          <Text>Your random username will be</Text>
          <Text>{userName}</Text>
        </Card>
        <Card style={SetupStyles.card}>
          <Text category="h6">How supported do you currently feel?</Text>
          <Text style={{ paddingTop: 2, paddingBottom: 2 }}>(required)</Text>
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
          <Text category="h6">
            No matter what I am facing, I have somewhere to voice my concerns
          </Text>
          <Text style={{ paddingTop: 2, paddingBottom: 2 }}>(required)</Text>
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
          <Text category="h6">I consider myself </Text>
          <Text style={{ paddingTop: 2, paddingBottom: 2 }}>(required)</Text>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ paddingTop: 8 }}>Introverted</Text>
            <Slider
              style={{ width: 200, height: 40 }}
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
          <Text category="h6">
            What are the leading causes of your stress? Please select TWO that
            most impact you. (This information will remain confidential.)
          </Text>
          <Text style={{ paddingTop: 2, paddingBottom: 2 }}>(required)</Text>
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
          <Text category="h6">
            Which communities within Kare would you like to join? Please choose
            at least 3. (This information will remain confidential.)
          </Text>
          <Text style={{ paddingTop: 2, paddingBottom: 2 }}>(required)</Text>
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
          onPress={async () => {
            setLoading(!loading);
            try {
              await addUser(values["email"], "password");
              await console.log(allUserInformation); // this will be subbed for creating the linked user db entry
              sendVerificationEmail();
              setLoading(!loading);
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: "VerifyEmail" }],
                })
              ); // routes to home and doesnt give option to go back
            } catch (err) {
              console.log(err); // in this case we just log it
              //navigation.navigate("Error"); // in reality we would nav to error page
            }
          }}
          disabled={!((isEnabled && !loading) || (!isEnabled && loading))}
          style={SetupStyles.button}
        >
          {buttonText}
        </Button>
        {
          <Button
            onPress={() => {
              navigation.navigate("Home");
            }}
            style={SetupStyles.button}
          >
            Go to Home debug
          </Button>
        }
        <Button
          onPress={() => {
            navigation.navigate("VerifyEmail");
          }}
          style={{
            borderColor: "#5505BA",
            backgroundColor: "#5505BA",
          }}
        >
          Go to Verify Email debug
        </Button>
      </ScrollView>
    </View>
  );
}
