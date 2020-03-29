import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text, withStyles, Button, Input } from "@ui-kitten/components";
import RNPickerSelect from 'react-native-picker-select';
import { ScrollView } from "react-native-gesture-handler";
import { addUser } from "../utils/FirebaseUtils";


function SetupSurvey({navigation}) {
    const [color, setColor] = useState("");
    const [userName, setUserName] = useState("");

    return (
    <View style={{ marginTop: 30, backgroundColor: "#F3EAFF", flex: 1 }}>
      <View style={{ alignItems: "center", marginTop: 15 }}>
        <Text category="h4">Setup Survey</Text>
      </View>
      <ScrollView>
        <Card style={styles.card}>
            <Text category="h6">Select your favorite Color:</Text>
            <RNPickerSelect
                style={pickerSelectStyles}
                onValueChange={(value) => setColor(value)}
                items={[
                    { label: 'Beige', value: 'beige' },
                    { label: 'Red', value: 'red' },
                    { label: 'Purple', value: 'purple' },
                    { label: 'Blue', value: 'blue' },
                    { label: 'Green', value: 'green' }
                ]}
            
            />
        </Card>
        <Card style={styles.card}>
            <Text category="h6">What is your spirit animal?</Text>
            <Input 
                onEndEditing={ e => {
                    var num1 = Math.floor(Math.random() * 1000).toString(10); 
                    var num2 = Math.floor(Math.random() * 1000).toString(10); 
                    return (
                        setUserName(num1 + e.nativeEvent.text.trim().toLowerCase() + num2)
                    ) 
                }}
            />
            <Text>Your random username will be</Text>
            <Text>{userName}</Text>
        </Card>
        <Card style={styles.card}>
            <Text category="h6">Question 1:</Text>
            <Input 
              onEndEditing={ e => {console.log(e)}} // placeholder for what we actually should do
            />
        </Card>
        <Card style={styles.card}>
            <Text category="h6">Question 2:</Text>
            <Input 
              onEndEditing={ e => {console.log(e)}} // placeholder for what we actually should do
            />
        </Card>
        <Card style={styles.card}>
            <Text category="h6">Question 3:</Text>
            <Input 
              onEndEditing={ e => {console.log(e)}} // placeholder for what we actually should do
            />
        </Card>
        <Card style={styles.card}> 
            <Text category="h6">Question 4:</Text>
            <Input 
              onEndEditing={ e => {console.log(e)}} // placeholder for what we actually should do
            />
        </Card>
        <Card style={styles.card}>
            <Text category="h6">Question 5:</Text>
            <Input 
              onEndEditing={ e => {console.log(e)}} // placeholder for what we actually should do
            />
        </Card>
        <Button 
            onPress={() => {
                try {
                  addUser({userName, color}); 
                } catch(err) {
                  console.log(err); // in this case we just log it
                  //navigation.navigate("Error"); // in reality we would nav to error page
                }
                navigation.navigate("Home")
            }}
            style={{
                borderColor: "#D6B8FF", 
                backgroundColor: "#D6B8FF"
            }}
        >
            Join Now!
        </Button>
      </ScrollView>
    </View>
    );
}


export default withStyles(SetupSurvey, theme => ({
    light: {
      backgroundColor: theme["color-primary-100"]
    }
  }));


  const styles = StyleSheet.create({
    card: {
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 10,
      borderRadius: 20,
      backgroundColor: "#FFFDF4"
    },
    mt: {
      marginTop: 20
    },
    mb: {
      marginBottom: 10
    }
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: 'purple',
      borderRadius: 8,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
  });