import { StyleSheet } from 'react-native';
export default StyleSheet.create({
    button: {
        backgroundColor: "#F3EAFF",
        marginLeft: 10,
        marginRight: 10,
        marginTop: 20,
        borderRadius: 20,
        marginBottom: 10,
        shadowOffset: { width: 5, height: 5 },
        shadowColor: "black",
        shadowOpacity: 1.0,
        elevation: 5,
    },
    buttonBox: {
        display: "flex",
        flexDirection: "row-reverse",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: '5%',
    },
    textBox: {
        flexDirection: "column",
    },
    imageBox: {
        backgroundColor: "#F3EAFF",
        maxHeight: 100,
        marginLeft: 15,
        marginRight: 10,
    },
    image: {
        resizeMode: 'contain',
        width: 60,
        height: 60
    }
});