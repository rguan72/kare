import { StyleSheet } from "react-native";
export default StyleSheet.create({
  container: {
    marginTop: 30,
    backgroundColor: "#F3EAFF",
    flex: 1,
  },
  header: {
    alignItems: "center",
    marginTop: 15,
    marginBottom: 15,
  },
  card: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: "#FFFDF4",
  },
  mt: {
    marginTop: 20,
  },
  mb: {
    marginBottom: 10,
  },
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  button: {
    borderColor: "#5505BA",
    backgroundColor: "#5505BA",
  },
});
