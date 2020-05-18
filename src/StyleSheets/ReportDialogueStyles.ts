import { StyleSheet } from "react-native";
import Colors from "../constants/userColors";
// TODO: update the styles so it looks good. Also you will need to add new items for inapropriateButton and spamButton
export default StyleSheet.create({
    container: {
        // placement
        height: "30%",
        width: "90%",
        position: "absolute",
        bottom: 0,
        marginBottom: "10%",
        zIndex: 1,
        // styling
        backgroundColor: "#F3EAFF",
        borderColor: Colors["karePurple"],
        borderWidth: 2,
        borderRadius: 20,
        shadowOffset: { width: 5, height: 5 }, // shadow prop is for iOS
        shadowColor: "black",
        shadowOpacity: 0.25,
        elevation: 5, // for android OS
        // alignment
        alignSelf: "center", 
        flexDirection: "column", 
    },
    descriptionBox: {
        //placement
        width: "80%",
        height: "10%",
        marginTop: 15,
        marginBottom: 10,
        //styling
        color: Colors["karePurple"],
        fontWeight: "bold",
        // borderBottomColor: Colors["karePurple"],
        // borderBottomWidth: 1,
        // alignment
        textAlign: "center",
        alignSelf: "center",
    },
    submitButton: {
        // placement
        bottom: "5%",
        position: "absolute",
        width: "25%",
        height: "12.5%",
        // styling
        backgroundColor: Colors["karePurple"],
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        elevation: 2, // for android
        shadowOffset: { width: 5, height: 5 }, // for iOS
        shadowColor: Colors["karePurple"],
        shadowOpacity: 1.0,
        // alignment
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center",
    },
    reportReasons: {
        // placement
        marginTop: 3,
        height: "15%",
        width: "90%",
        //styling
        backgroundColor: "#F3EAFF",
        elevation: 1,
        shadowOffset: { width: 3, height: 3 },
        shadowColor: "black",
        shadowOpacity: 0.5,
        borderRadius: 3,
        // alignment
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
    },
})

/*import React, { useState, useEffect } from "react";
import {
	Animated,
	KeyboardAvoidingView,
	View,
	Text,
	Keyboard,
	TouchableOpacity,
	ActivityIndicator,
	FlatList,
  } from "react-native";
  

  export default function ReportPopup({ navigation }) {
	  
  };

  const SlideUpView = (props) => {
	  const slideAnim = useRef(new Animated.Value(0)).current

	  React.useEffect(() => {
		  Animated.timing(
			  slideAnim,
			  {
				  toValue: 1,
				  duration: 100,
			  }
		  ).start();
	  }, [])

	  return
  }
  Animated.timing(this.state.xPosition, {
	toValue: 100,
	easing: Easing.back(),
	duration: 100
  }).start();

*/