import React, {useState} from "react";
import {Text} from "@ui-kitten/components";
import {View, ScrollView, TouchableOpacity} from "react-native";
import screens from "../constants/screenNames";
import UserAgreementStyles from "../StyleSheets/UserAgreementStyles";
import { turquoise } from "color-name";
import {Dimensions} from 'react-native';
import {Header} from "../constants/UserAgreementLanguage.json";
import {SubHeader} from "../constants/UserAgreementLanguage.json";
import {BoldText} from "../constants/UserAgreementLanguage.json";
import {GeneralText} from "../constants/UserAgreementLanguage.json";
import {BoldItalics} from "../constants/UserAgreementLanguage.json";
import {BoldUnderline} from "../constants/UserAgreementLanguage.json";
import {CapsLock} from "../constants/UserAgreementLanguage.json";

export default function UserAgreement({ navigation, route }) {
    const [agreed, setAgreed] = useState(false);
    const [goNext, setGoNext] = useState(false);


    function onCheckboxPress() {
        setAgreed(!agreed);
    };

    function onNextPress() {
        if (agreed) {
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
                <Text category = 'h5' style={UserAgreementStyles.heading}>{Header}</Text>
                <Text category = 'h6' style={UserAgreementStyles.heading}>{SubHeader}</Text>
                <Text><Text style={UserAgreementStyles.Bold}> {BoldText.A}</Text><Text>{GeneralText.A}</Text><Text style={UserAgreementStyles.BoldItalics}>{BoldItalics.A}</Text><Text>{GeneralText.B}</Text><Text style={UserAgreementStyles.BoldItalics}>{BoldItalics.B}</Text><Text>{GeneralText.C}</Text><Text style={UserAgreementStyles.BoldItalics}>{BoldItalics.C}</Text><Text>{GeneralText.D}</Text><Text style={UserAgreementStyles.BoldItalics}>{BoldItalics.D}</Text><Text>{GeneralText.E}</Text></Text>
                <Text><Text style={UserAgreementStyles.BoldUnderlined}>{BoldUnderline.A}</Text><Text>{GeneralText.F}</Text><Text style={UserAgreementStyles.BoldItalics}>{BoldItalics.E}</Text><Text>{GeneralText.G}</Text></Text>
                <Text><Text style={UserAgreementStyles.BoldUnderlined}>{BoldUnderline.B}</Text><Text>{GeneralText.H}</Text><Text style={UserAgreementStyles.BoldItalics}>{BoldItalics.F}</Text><Text>{GeneralText.I}</Text></Text>
                <Text><Text style={UserAgreementStyles.BoldUnderlined}>{BoldUnderline.C}</Text><Text>{GeneralText.J}</Text><Text style={UserAgreementStyles.BoldItalics}>{BoldItalics.G}</Text><Text>{GeneralText.K}</Text></Text>
                <Text><Text style={UserAgreementStyles.BoldUnderlined}>{BoldUnderline.D}</Text><Text>{GeneralText.L}</Text></Text>
                <Text><Text style={UserAgreementStyles.BoldUnderlined}>{BoldUnderline.E}</Text><Text>{GeneralText.M}</Text><Text style={UserAgreementStyles.CapsLock}>{CapsLock.A}</Text></Text>
                <Text><Text style={UserAgreementStyles.BoldUnderlined}>{BoldUnderline.F}</Text><Text style={UserAgreementStyles.CapsLock}>{CapsLock.B}</Text></Text>
                <Text><Text style={UserAgreementStyles.BoldUnderlined}>{BoldUnderline.G}</Text><Text>{GeneralText.N}</Text></Text>
                <Text><Text style={UserAgreementStyles.BoldUnderlined}>{BoldUnderline.H}</Text><Text>{GeneralText.O}</Text></Text>
                <Text><Text style={UserAgreementStyles.BoldUnderlined}>{BoldUnderline.I}</Text><Text>{GeneralText.P}</Text></Text>
            </ScrollView>
            <View style={UserAgreementStyles.errorBox}>
                {goNext && !agreed && <Text style={UserAgreementStyles.errorText}>
                    You must accept the Terms & Conditions before proceeding.
                </Text>}
                <TouchableOpacity style={UserAgreementStyles.agreementBox} onPress={onCheckboxPress}>
                    <View style={UserAgreementStyles.checkbox}>
                        {agreed && <Text style={UserAgreementStyles.x}>X</Text>}
                    </View>
                    <Text style={UserAgreementStyles.agreementText}> I have read and accept the Terms & Conditions</Text>
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