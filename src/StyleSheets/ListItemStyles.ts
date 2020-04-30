import { StyleSheet } from 'react-native';
export default StyleSheet.create({
    card: {
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 10,
      borderRadius: 20
    },
    userName: {
      marginBottom: 10
    },
    date: {
      color: "rgba(0, 0, 0, 0.3)",
    },
    bottomRow: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20
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
      width: 20,
      height: 20,
      borderRadius: 5,
      overflow: "hidden"
    }
});