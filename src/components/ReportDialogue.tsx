import React, { useState } from "react";
import {View, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard} from "react-native";
import {Text, Input } from "@ui-kitten/components";
import ReportDialogueStyles from "../StyleSheets/ReportDialogueStyles"
import { TouchableWithoutFeedback } from "@ui-kitten/components/devsupport";
import PropTypes from "prop-types";
import Colors from "../constants/userColors";
import Report from "../constants/Report";
import {addReport} from "../utils/FirebaseUtils";


export default function ReportDialogue({reporterID, reporteeID, comment, commentRef, closeReportDialogue_}){
    const [helpFlag, setHelpFlag] = useState(false);
    const [isInappropriate, setIsInappropriate] = useState(false);
    const [isSpam, setIsSpam] = useState(false);
    const [helpButtonBackground, setHelpButtonBackground] = useState("#F3EAFF");
    const [helpButtonText, setHelpButtonText] = useState("black");
    const [inappropriateButtonBackground, setInnapropriateButtonBackground] = useState(helpButtonBackground);
    const [inappropriateButtonText, setInnapropriateButtonText] = useState(helpButtonText);
    const [spamButtonBackground, setSpamButtonBackground] = useState(helpButtonBackground);
    const [spamButtonText, setSpamButtonText] = useState(helpButtonText);

    const submitReport = () => {
        console.log("Report has been sent to Kare, with the following reasons: "); 
        console.log(reporteeID);
        console.log(reporterID);
        console.log(comment);
        console.log(commentRef);
        let report = new Report(reporterID,reporteeID,comment,commentRef,helpFlag,isInappropriate,isSpam);
        addReport(report);
        closeReportDialogue_();
    }
    const submitHelpFlag = () => {
        setHelpFlag(!helpFlag);
        if (helpButtonBackground == "#F3EAFF") {
            setHelpButtonBackground(Colors["karePurple"]);
            setHelpButtonText("white");
        } else {
            setHelpButtonBackground("#F3EAFF")
            setHelpButtonText("black");
        }
    }
    const submitInappropriate = () => {
        setIsInappropriate(!isInappropriate);
        if (inappropriateButtonBackground == "#F3EAFF") {
            setInnapropriateButtonBackground(Colors["karePurple"]);
            setInnapropriateButtonText("white");
        } else {
            setInnapropriateButtonBackground("#F3EAFF")
            setInnapropriateButtonText("black");
        }
        console.log("Inappropriate post has been marked.")
    }
    const submitSpam = () => {
        setIsSpam(!isSpam);
        if (spamButtonBackground == "#F3EAFF") {
            setSpamButtonBackground(Colors["karePurple"]);
            setSpamButtonText("white");
        } else {
            setSpamButtonBackground("#F3EAFF")
            setSpamButtonText("black");
        }
        console.log("Spam post has been marked.");
    }
    // TODO: Create a close button. It can be another touchable opacity but will be very small. just make sure you make the onPress={closeReportDialogue_} and it should work.


    return (
        <View  style={ReportDialogueStyles.container}>   
            <Text style={ReportDialogueStyles.descriptionBox} category="h6">
                Why are you reporting this post?
            </Text>
            <TouchableOpacity style={[ReportDialogueStyles.reportReasons,{backgroundColor: helpButtonBackground}]} onPress={submitHelpFlag}>
                <Text style={{color: helpButtonText}}>Flag for help</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[ReportDialogueStyles.reportReasons, {backgroundColor: inappropriateButtonBackground}]} onPress={submitInappropriate}>
                <Text style={{color: inappropriateButtonText}}>Content is inappropriate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[ReportDialogueStyles.reportReasons, {backgroundColor: spamButtonBackground}]} onPress={submitSpam}>
                <Text style={{color: spamButtonText}}>Content is spam</Text>
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


