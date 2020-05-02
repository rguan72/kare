import React, {useState} from "react";
import {Text} from "@ui-kitten/components";
import {View, ScrollView, TouchableOpacity} from "react-native";
import screens from "../constants/screenNames";
import UserAgreementStyles from "../StyleSheets/UserAgreementStyles";
import { turquoise } from "color-name";
import {Dimensions} from 'react-native';

export default function UserAgreement({ navigation, route }) {
    const [agreed, setAgreed] = useState("");
    const [goNext, setGoNext] = useState(false);


    function onCheckboxPress() {
        console.log(Dimensions.get("window").width);
        console.log(Dimensions.get("window").height);
        if (agreed == "x") {
            setAgreed("");
        } else {
            setAgreed("x");
        }
    };

    function onNextPress() {
        if (agreed == "x") {
            navigation.navigate(screens.setup, {
                email: route.params.email,
                password: route.params.password,
            });
        }
        setGoNext(true);
    };
    

    return (
        <View style={UserAgreementStyles.container}>
            <ScrollView style={UserAgreementStyles.scrollView}>
                <Text category = 'h5' style={UserAgreementStyles.heading}>User Agreement</Text>
                <Text style={UserAgreementStyles.text}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
                sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
                est laborum.
                </Text>
            </ScrollView>
            <View style={UserAgreementStyles.errorBox}>
                {goNext == true && agreed != "x" && <Text style={UserAgreementStyles.errorText}>
                    You must agree to the user agreement before proceeding.
                </Text>}
                <TouchableOpacity style={UserAgreementStyles.agreementBox} onPress={onCheckboxPress}>
                    <View style={UserAgreementStyles.checkbox}>
                        <Text style={UserAgreementStyles.x}>{agreed}</Text>
                    </View>
                    <Text style={UserAgreementStyles.agreementText}> I have read and agree to the user agreement</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={UserAgreementStyles.button} onPress={onNextPress}>
                <Text style={UserAgreementStyles.buttonText}>
                Next
                </Text>
            </TouchableOpacity>
        </View>
    );
};