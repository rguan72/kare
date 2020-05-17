import { StyleSheet } from "react-native";
// TODO: update the styles so it looks good. Also you will need to add new items for inapropriateButton and spamButton
export default StyleSheet.create({
    container: {
        height: "50%",
        position: "absolute",
        bottom: 0,
        zIndex: 1,
        backgroundColor: "dimgray",
        width: "90%",
        alignSelf: "center",
        marginBottom: "5%",
        borderRadius: 20,
        flexDirection: "column"
    },
    descriptionBox: {
        width: "80%",
        alignSelf: "center",
        bottom: "25%",
        position: "absolute"
    },
    submitButton: {
        alignSelf:"center",
        position: "absolute",
        bottom: "5%",
        backgroundColor: "white"
    },
    reportReasons: {
        alignSelf: "center",
        position: "absolute",
        height: "10%",
        
    },
})