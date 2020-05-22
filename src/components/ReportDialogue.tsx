import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text, Modal } from "@ui-kitten/components";
import ReportDialogueStyles from "../StyleSheets/ReportDialogueStyles";
import PropTypes from "prop-types";
import Colors from "../constants/userColors";
import Report from "../constants/Report";
import { addReport } from "../utils/FirebaseUtils";

export default function ReportDialogue({
  reporterID,
  reporteeID,
  comment,
  commentRef,
  closeReportDialogue_,
  showReportDialogue_,
}) {
  const [helpFlag, setHelpFlag] = useState(false);
  const [isInappropriate, setIsInappropriate] = useState(false);
  const [isSpam, setIsSpam] = useState(false);
  const [helpButtonBackground, setHelpButtonBackground] = useState("#F3EAFF");
  const [helpButtonText, setHelpButtonText] = useState("black");
  const [
    inappropriateButtonBackground,
    setInnapropriateButtonBackground,
  ] = useState(helpButtonBackground);
  const [inappropriateButtonText, setInnapropriateButtonText] = useState(
    helpButtonText
  );
  const [spamButtonBackground, setSpamButtonBackground] = useState(
    helpButtonBackground
  );
  const [spamButtonText, setSpamButtonText] = useState(helpButtonText);

  const submitReport = () => {
    let report = new Report(
      reporterID,
      reporteeID,
      comment,
      commentRef,
      helpFlag,
      isInappropriate,
      isSpam
    );
    addReport(report);
    closeReportDialogue_();
  };
  const submitHelpFlag = () => {
    setHelpFlag(!helpFlag);
    if (helpButtonBackground == "#F3EAFF") {
      setHelpButtonBackground(Colors["karePurple"]);
      setHelpButtonText("white");
    } else {
      setHelpButtonBackground("#F3EAFF");
      setHelpButtonText("black");
    }
  };
  const submitInappropriate = () => {
    setIsInappropriate(!isInappropriate);
    if (inappropriateButtonBackground == "#F3EAFF") {
      setInnapropriateButtonBackground(Colors["karePurple"]);
      setInnapropriateButtonText("white");
    } else {
      setInnapropriateButtonBackground("#F3EAFF");
      setInnapropriateButtonText("black");
    }
  };
  const submitSpam = () => {
    setIsSpam(!isSpam);
    if (spamButtonBackground == "#F3EAFF") {
      setSpamButtonBackground(Colors["karePurple"]);
      setSpamButtonText("white");
    } else {
      setSpamButtonBackground("#F3EAFF");
      setSpamButtonText("black");
    }
  };

  return (
    <Modal
      visible={showReportDialogue_}
      backdropStyle={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
      onBackdropPress={closeReportDialogue_}
      style={ReportDialogueStyles.container}
    >
      <View style={{ flex: 1 }}>
        <Text style={ReportDialogueStyles.descriptionBox}>
          Why are you reporting this post?
        </Text>
        <TouchableOpacity
          style={[
            ReportDialogueStyles.reportReasons,
            { height:"13%" },
          ]}
          onPress={submitHelpFlag}
        >
          <Text style={{ color: "white" }}>Flag for help</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            ReportDialogueStyles.reportReasons,
            { height: "13%" },
          ]}
          onPress={submitInappropriate}
        >
          <Text style={{ color: "white" }}>
            Content is inappropriate
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            ReportDialogueStyles.reportReasons,
            { height: "13%" },
          ]}
          onPress={submitSpam}
        >
          <Text style={{ color: "white" }}>Content is spam</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            ReportDialogueStyles.submitButton, 
            { height: "13%" },
          ]}
          onPress={submitReport}
        >
          <View>
            <Text style={{ color: "white" }}>Submit</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

ReportDialogue.propTypes = {
  reporterID: PropTypes.string.isRequired,
  reporteeID: PropTypes.string.isRequired,
  closeReportDialogue_: PropTypes.func.isRequired,
};
