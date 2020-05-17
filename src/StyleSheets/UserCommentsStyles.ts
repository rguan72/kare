import { StyleSheet } from 'react-native';
export default StyleSheet.create({
    footer: {
        justifyContent: "flex-end",
        flex: 1,
    },
    flex: {
        display: "flex",
    },
    header: {
        backgroundColor: "#F3EAFF",
        marginTop: 60,
        marginBottom: 10,
        display: "flex",
        flexDirection: "row-reverse",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingTop: 15,
        paddingLeft: 40,
    },
    headerTextbox: {
        flexDirection: "column",
        marginLeft: 10,
        backgroundColor: "#F3EAFF",
    },
    safeAreaView: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "#F3EAFF",
    },
    commentBox: {
        justifyContent: "flex-end",
        backgroundColor: "#F3EAFF",
        flexDirection: "column",
    },
    mt0: {
        marginTop: 0,
    },
    // add the "..."
    otherOptions: {
        justifyContent: "flex-start",
        align-content: "flex-end",
        // something from uikitten?
    },
});