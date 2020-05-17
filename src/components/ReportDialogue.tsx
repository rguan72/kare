import React, { useState } from "react";
import {View, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard} from "react-native";
import {Text, Input } from "@ui-kitten/components";
import ReportDialogueStyles from "../StyleSheets/ReportDialogueStyles"
import { TouchableWithoutFeedback } from "@ui-kitten/components/devsupport";
import PropTypes from "prop-types";


export default function ReportDialogue({reporterID, reporteeID, closeReportDialogue_}){
    const [isInappropriate, setIsInappropriate] = useState(false);
    const [isSpam, setIsSpam] = useState(false);
    const [description, setDescription] = useState("");
    const submitReport = () => {
        console.log("You're reported!");
        console.log(description);
        console.log(reporteeID);
        console.log(reporterID);
        closeReportDialogue_();
    }
    const submitInappropriate = () => {
        setIsInappropriate(!isInappropriate);
    }
    const submitSpam = () => {
        setIsSpam(!isSpam);
    }


    return (
        <KeyboardAvoidingView /* why does this need to be avoidingview */
        style={ReportDialogueStyles.container}
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        >   
            <TouchableWithoutFeedback style={{flex: 1}} onPress={Keyboard.dismiss}>
            {/* TODO: You will want two more touchable opacities, one to press if something is inapropriate, one for if it is spam. Also, make them react so you can tell if one is checked true or false. */}
                <Input
                    style={ReportDialogueStyles.descriptionBox}
                    placeholder="Why are you reporting this comment?"
                    value={description}
                    onChangeText={setDescription}
                />
            </TouchableWithoutFeedback>
            <TouchableOpacity style={ReportDialogueStyles.reportReasons} onPress={submitInappropriate}>
                <Text>Content is inappropriate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={ReportDialogueStyles.reportReasons} onPress={submitSpam}>
                <Text>Content is spam</Text>
            </TouchableOpacity>
            <TouchableOpacity style={ReportDialogueStyles.submitButton} onPress={submitReport}>
                <Text>submit</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};

ReportDialogue.propTypes = {
    reporterID: PropTypes.string.isRequired,
    reporteeID: PropTypes.string.isRequired,
    closeReportDialogue_: PropTypes.func.isRequired
};