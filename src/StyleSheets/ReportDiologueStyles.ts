import { StyleSheet } from "react-native";
// TODO: update the styles so it looks good. Also you will need to add new items for inapropriateButton and spamButtom
export default StyleSheet.create({
    container: {
        height: "70%",
        position: "absolute",
        bottom: 0,
        zIndex:1,
        backgroundColor: "dimgray",
        width: "96%",
        alignSelf: "center",
        marginBottom: "2%",
        borderRadius: 20,
        flexDirection: "column"
    },
    descriptionBox: {
        width: "90%",
        alignSelf: "center",
        bottom: "25%",
        position: "absolute"
    },
    submitButton: {
        alignSelf:"center",
        position: "absolute",
        bottom: "5%",
        backgroundColor: "white"
    }
})