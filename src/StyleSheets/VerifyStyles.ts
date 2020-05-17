import { StyleSheet } from "react-native";
import colors from "../constants/userColors";
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
  },
  nextButton: {
    marginBottom: 20,
    marginRight: 20,
  },
  mt: {
    marginTop: 10,
  },
  doneButton: {
    marginTop: 5,
  },
});
