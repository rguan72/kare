import React, { useState } from "react";
import {View, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard} from "react-native";
import {Text, Input } from "@ui-kitten/components";
import ReportDialogueStyles from "../StyleSheets/ReportDialogueStyles"
import { TouchableWithoutFeedback } from "@ui-kitten/components/devsupport";
import PropTypes from "prop-types";
import Colors from "../constants/userColors"


export default function ReportDialogue({reporterID, reporteeID, closeReportDialogue_}){
    const [helpFlag, setHelpFlag] = useState(false);
    const [isInappropriate, setIsInappropriate] = useState(false);
    const [isSpam, setIsSpam] = useState(false);
    const [description, setDescription] = useState("");
    const submitReport = () => {
        console.log("Report has been sent to Kare, with the following reasons: "); 
        console.log(description);
        console.log(reporteeID);
        console.log(reporterID);
        closeReportDialogue_();
    }
    const submitHelpFlag = () => {
        setHelpFlag(!helpFlag);
        console.log("Submitted Help Flag has been marked."); //Here, I was thinking we can make check marks or checkboxes for reasons why a post should be reported. Then at the end they click submit. This way, we can address the concern of a user reporting a post for multiple reasons.
    }
    const submitInappropriate = () => {
        setIsInappropriate(!isInappropriate);
        console.log("Inappropriate post has been marked.")
    }
    const submitSpam = () => {
        setIsSpam(!isSpam);
        console.log("Spam post has been marked.");
    }


    return (
        <View  // view
        style={ReportDialogueStyles.container}
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        >   
            {/* <TouchableWithoutFeedback style={{flex: 1}} onPress={Keyboard.dismiss}>
            { TODO: You will want two more touchable opacities, one to press if something is inapropriate, one for if it is spam. Also, make them react so you can tell if one is checked true or false.}
                <Input
                    style={ReportDialogueStyles.descriptionBox}
                    placeholder="Why are you reporting this comment?"
                    value={description}
                    onChangeText={setDescription}
                />
            </TouchableWithoutFeedback>*/} 
            <Text style={ReportDialogueStyles.descriptionBox} category="h6">
                Why are you reporting this post?
            </Text>
            <TouchableOpacity style={ReportDialogueStyles.reportReasons} onPress={submitHelpFlag}>
                <Text>Flag for help</Text>
            </TouchableOpacity>
            <TouchableOpacity style={ReportDialogueStyles.reportReasons} onPress={submitInappropriate}>
                <Text>Content is inappropriate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={ReportDialogueStyles.reportReasons} onPress={submitSpam}>
                <Text>Content is spam</Text>
            </TouchableOpacity>
            <TouchableOpacity style={ReportDialogueStyles.submitButton} onPress={submitReport}>
                <View><Text style={{ color: "white" }}>Submit</Text></View>
            </TouchableOpacity>
        </View>
    );
};

ReportDialogue.propTypes = {
    reporterID: PropTypes.string.isRequired,
    reporteeID: PropTypes.string.isRequired,
    closeReportDialogue_: PropTypes.func.isRequired
};


