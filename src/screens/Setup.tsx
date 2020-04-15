import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text, withStyles, Button, Input } from "@ui-kitten/components";
import RNPickerSelect from "react-native-picker-select";
import { ScrollView } from "react-native-gesture-handler";
import { addUser } from "../utils/FirebaseUtils";
import { CommonActions } from "@react-navigation/native";

function SetupSurvey({ navigation }) {
  // initial state
  const initialState = {
    username: "",
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
  };
  const [color, setColor] = useState("");
  const [userName, setUserName] = useState("");
  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);

  function handleEventChange(e, name) {
    console.log(values);
    setValues({ ...values, [name]: e.nativeEvent.text });
  }

  var isEnabled =
    values["username"].length > 0 &&
    values["q1"].length > 0 &&
    values["q2"].length > 0 &&
    values["q3"].length > 0 &&
    values["q4"].length > 0 &&
    values["q5"].length > 0 &&
    color.length > 0;

  var buttonText = !loading ? "Join Now!" : "Loading...";

  return (
    <View style={{ marginTop: 30, backgroundColor: "#F3EAFF", flex: 1 }}>
      <ScrollView>
        <View style={{ alignItems: "center", marginTop: 15, marginBottom: 15 }}>
          <Text category='h4'>Setup Survey</Text>
        </View>
        <Card style={styles.card}>
          <Text category='h6'>Select your favorite Color: (Required)</Text>
          <RNPickerSelect
            style={pickerSelectStyles}
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
        <Card style={styles.card}>
          <Text category='h6'>What is your spirit animal? (Required)</Text>
          <Input
            value={values["username"]}
            onChange={(e) => {
              handleEventChange(e, "username");
            }}
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
        <Card style={styles.card}>
          <Text category='h6'>Question 1: (Required)</Text>
          <Input
            value={values["q1"]}
            onChange={(e) => handleEventChange(e, "q1")}
            onEndEditing={(e) => {
              console.log(e);
            }} // placeholder for what we actually should do
          />
        </Card>
        <Card style={styles.card}>
          <Text category='h6'>Question 2: (Required)</Text>
          <Input
            value={values["q2"]}
            onChange={(e) => handleEventChange(e, "q2")}
            onEndEditing={(e) => {
              console.log(e);
            }} // placeholder for what we actually should do
          />
        </Card>
        <Card style={styles.card}>
          <Text category='h6'>Question 3: (Required)</Text>
          <Input
            value={values["q3"]}
            onChange={(e) => handleEventChange(e, "q3")}
            onEndEditing={(e) => {
              console.log(e);
            }} // placeholder for what we actually should do
          />
        </Card>
        <Card style={styles.card}>
          <Text category='h6'>Question 4: (Required)</Text>
          <Input
            value={values["q4"]}
            onChange={(e) => handleEventChange(e, "q4")}
            onEndEditing={(e) => {
              console.log(e);
            }} // placeholder for what we actually should do
          />
        </Card>
        <Card style={styles.card}>
          <Text category='h6'>Question 5: (Required)</Text>
          <Input
            value={values["q5"]}
            onChange={(e) => handleEventChange(e, "q5")}
            onEndEditing={(e) => {
              console.log(e);
            }} // placeholder for what we actually should do
          />
        </Card>
        <Button
          onPress={() => {
            setLoading(!loading);
            try {
              setTimeout(() => {
                addUser({ userName, color });
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: "Home" }],
                  })
                ); // routes to home and doesnt give option to go back
              }, 2000); // keep the user loading for a bit

              setLoading(!loading);
            } catch (err) {
              console.log(err); // in this case we just log it
              //navigation.navigate("Error"); // in reality we would nav to error page
            }
          }}
          disabled={!isEnabled}
          style={{
            borderColor: "#5505BA",
            backgroundColor: "#5505BA",
          }}
        >
          {buttonText}
        </Button>
        {
          <Button
            onPress={() => {
              navigation.navigate("Home");
            }}
            style={{
              borderColor: "#5505BA",
              backgroundColor: "#5505BA",
            }}
          >
            Go to Home debug
          </Button>
        }
      </ScrollView>
    </View>
  );
}

export default withStyles(SetupSurvey, (theme) => ({
  light: {
    backgroundColor: theme["color-primary-100"],
  },
}));

const styles = StyleSheet.create({
  card: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: "#FFFDF4",
  },
  mt: {
    marginTop: 20,
  },
  mb: {
    marginBottom: 10,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
