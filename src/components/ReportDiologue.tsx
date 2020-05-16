import React, { useState } from "react";
import {View, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard} from "react-native";
import {Text, Input } from "@ui-kitten/components";
import ReportDiologueStyles from "../StyleSheets/ReportDiologueStyles"
import { TouchableWithoutFeedback } from "@ui-kitten/components/devsupport";
import PropTypes from "prop-types";


export default function ReportDiologue({reporterID, reporteeID, closeReportDiologue_}){
    const [isInapropriate, setIsInappropriate] = useState(false);
    const [isSpam, setIsSpam] = useState(false);
    const [description, setDescription] = useState("");
    const submitReport = () => {
        console.log("You're reported!");
        console.log(description);
        console.log(reporteeID);
        console.log(reporterID);
        closeReportDiologue_();
    }
    const submitInapropriate = () => {
        setIsInappropriate(!isInapropriate);
    }
    const submitSpam = () => {
        setIsSpam(!isSpam);
    }


    return (
        <KeyboardAvoidingView 
        style={ReportDiologueStyles.container}
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        >   
            <TouchableWithoutFeedback style={{flex: 1}} onPress={Keyboard.dismiss}>
            {/* TODO: You will want two more touchable opacities, one to press if something is inapropriate, one for if it is spam. Also, make them react so you can tell if one is checked true or false. */}
                <Input
                    style={ReportDiologueStyles.descriptionBox}
                    placeholder="Why are you reporting this comment?"
                    value={description}
                    onChangeText={setDescription}
                />
            </TouchableWithoutFeedback>
            <TouchableOpacity style={ReportDiologueStyles.submitButton} onPress={submitReport}>
                <Text>submit</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};

ReportDiologue.propTypes = {
    reporterID: PropTypes.string.isRequired,
    reporteeID: PropTypes.string.isRequired,
    closeReportDiologue_: PropTypes.func.isRequired
};