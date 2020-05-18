import { StyleSheet } from "react-native";
import Colors from "../constants/userColors";
export default StyleSheet.create({
  parent: {
    display: "flex",
    flexGrow: 1,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3EAFF",
  },
  closeButton: {
    marginTop: 5,
    backgroundColor: "#5505BA",
  },
  nextButton: {
    marginBottom: 20,
    marginRight: 20,
  },
  mt: {
    marginTop: 10,
  },
  verifyButton: {
    backgroundColor: "#5505BA",
    borderColor: "#5505BA",
  },
  doneButton: {
    marginTop: 5,
    backgroundColor: "#5505BA",
    borderColor: "#5505BA",
  },
});
