import { StyleSheet } from "react-native";
export default StyleSheet.create({
  footer: {
    justifyContent: "flex-end",
    flex: 1,
  },
  header: {
    backgroundColor: "#F3EAFF",
    //marginTop: 60,
    marginBottom: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    paddingTop: 15,
    paddingLeft: 10,
  },
  headerTextBox: {
    flexDirection: "column",
    marginLeft: 10,
    backgroundColor: "#F3EAFF",
    marginRight: 10,
    width: "85%",
  },
  icon: {
    flexShrink: 1,
    width: 60,
    height: 60,
    marginLeft: 11,
    resizeMode: "contain",
  },
  safeAreaView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#F3EAFF",
  },
  sectionHeader: {
    marginLeft: 25,
    marginBottom: 3,
    marginTop: 10,
  },
  commentBox: {
    justifyContent: "flex-end",
    backgroundColor: "#F3EAFF",
    flexDirection: "column",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  submitButton: {
    marginTop: 0,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
});
