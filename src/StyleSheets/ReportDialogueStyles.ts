import { StyleSheet } from "react-native";
import Colors from "../constants/userColors";
// TODO: update the styles so it looks good. Also you will need to add new items for inapropriateButton and spamButton
export default StyleSheet.create({
  container: {
    // placement
    height: "30%",
    width: "90%",
    // position: "absolute",
    // bottom: 0,
    // marginBottom: "10%",
    zIndex: 2,
    // styling
    backgroundColor: "#d3d3d3",
    borderColor: "#d3d3d3",
    borderWidth: 2,
    borderRadius: 20,
    shadowOffset: { width: 5, height: 5 }, // shadow prop is for iOS
    shadowColor: "black",
    shadowOpacity: 0.25,
    elevation: 5, // for android OS
    // alignment
    alignSelf: "center",
    flexDirection: "column",
  },
  descriptionBox: {
    //placement
    width: "80%",
    height: "10%",
    marginTop: 15,
    marginBottom: 10,
    zIndex: 2,
    //styling
    color: Colors["karePurple"],
    fontWeight: "bold",
    // borderBottomColor: Colors["karePurple"],
    // borderBottomWidth: 1,
    // alignment
    textAlign: "center",
    alignSelf: "center",
  },
  submitButton: {
    // placement
    bottom: "5%",
    position: "absolute",
    width: "90%",
    height: "20%",
    "marginTop": 3,
    zIndex: 2,
    // styling
    backgroundColor: Colors["karePurple"],
    borderWidth: 1,
    borderRadius: 5,
    elevation: 2, // for android
    // alignment
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  reportReasons: {
    // placement
    marginTop: 3,
    marginBottom: 3,
    height: "20%",
    width: "90%",
    zIndex: 2,
    //styling
    backgroundColor: Colors["karePurple"],
    elevation: 1,
    borderRadius: 3,
    // alignment
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});
