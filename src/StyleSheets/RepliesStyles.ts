import { Dimensions, Platform, PixelRatio, StyleSheet } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const scale = SCREEN_WIDTH / 375;

export function normalize(size) {
  const newSize = size * scale;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

export default StyleSheet.create({
  footer: {
    justifyContent: "flex-end",
    flex: 1,
  },
  flex: {
    display: "flex",
  },
  mt0: {
    marginTop: 0,
  },
  mb: {
    marginBottom: 20,
  },
  mt: {
    marginTop: 80,
  },
  bgColor: {
    backgroundColor: "#F3EAFF",
  },
  card: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 20,
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 44 / 2,
  },
  square: {
    width: 20,
    height: 20,
    borderRadius: 5,
    overflow: "hidden",
  },
  userName: {
    marginBottom: 8,
    fontSize: normalize(12),
  },
  date: {
    color: "rgba(0, 0, 0, 0.3)",
    fontSize: normalize(12),
  },
  comment: {
    fontSize: normalize(16),
    fontWeight: "bold",
  },
});
