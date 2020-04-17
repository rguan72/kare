import { StyleSheet } from 'react-native';
export default StyleSheet.create({
    footer: {
        justifyContent: "flex-end",
        flex: 1,
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
    headerTextBox: {
        flexDirection: "column",
        marginLeft: 10,
        backgroundColor: "#F3EAFF",
    },
    icon: {
        flexShrink: 1,
        maxWidth: 60,
        maxHeight: 60,
        marginLeft: 15,
    },
    safeAreaView: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "#F3EAFF",
    },
    sectionHeader: {
        marginLeft: 25,
        marginBottom: 3,
        marginTop: 10
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

});