import { StyleSheet } from "react-native";
import colors from "../constants/userColors";
export default StyleSheet.create({
  parent: {
    display: "flex",
    flexGrow: 1,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors["purple"],
  },
  nextView: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  nextButton: {
    marginBottom: 20,
    marginRight: 20,
  },
  mt: {
    marginTop: 20,
  },
  userName: {
    marginBottom: 10,
  },
  date: {
    color: "rgba(0, 0, 0, 0.3)",
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 44 / 2,
  },
  square: {
    marginRight: 5,
    width: 20,
    height: 20,
    borderRadius: 5,
    overflow: "hidden",
  },
});
