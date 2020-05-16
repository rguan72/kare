import React, { useState, useEffect } from "react";
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

