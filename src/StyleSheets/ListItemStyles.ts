import { Dimensions, Platform, PixelRatio, StyleSheet } from "react-native";

const {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
} = Dimensions.get('window');

const scale = SCREEN_WIDTH / 375;

export function normalize(size) {
  const newSize = size * scale 
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  }
}

export default StyleSheet.create({
    card: {
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 10,
      borderRadius: 20
    },
    userName: {
      marginBottom: 8,
      fontSize: normalize(12),
    },
    date: {
      color: "rgba(0, 0, 0, 0.3)",
      fontSize: normalize(12),
    },
    bottomRow: {
      flex: 1,
      flexDirection: "row",
      justifyContent: 'space-between',
      marginTop: 8,
    },
    comments: {
      fontSize: normalize(16),
      fontWeight: "bold",
    },
    report: {
      fontSize: 13,
      marginTop: 20, 
      opacity: .5
    },
    circle: {
      width: 44,
      height: 44,
      borderRadius: 44 / 2
    },
    square: {
      marginRight: 5,
      width: 15,
      height: 15,
      borderRadius: 5,
      overflow: "hidden"
    }
});