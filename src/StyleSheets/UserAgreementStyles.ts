import { StyleSheet } from "react-native";
import {Dimensions} from 'react-native';

export default StyleSheet.create({
    container: {
        backgroundColor: "#F3EAFF",
        flex: 1,
        alignItems: "center",
    },
    scrollView: {
        paddingVertical: '5%',
        paddingHorizontal: '2%',
        backgroundColor: 'white',
        marginTop: '20%',
        marginHorizontal: '10%',
        marginBottom: '5%'
    },
    text: {
        marginTop: '2%',
        fontSize: Dimensions.get("window").height*0.0204,
    },
    heading: {
        textAlign: "center",
    },
    errorBox: {
        width: '100%',
        alignItems: 'center'
    },
    errorText: {
        fontSize: Dimensions.get("window").height*0.0204,
        color: 'red',
        flexShrink: 1,
    },
    agreementBox: {
        paddingTop: '2%',
        flexDirection: 'row',
    },
    checkbox: {
        borderBottomColor: 'black',
        borderWidth: 1,
        backgroundColor: '#F3EAFF',
        height: Dimensions.get("window").height*0.0272,
        width: Dimensions.get("window").width*0.0483,
        alignItems: 'center',
        justifyContent: 'center',
    },
    x: {
        fontSize: Dimensions.get("window").height*0.0204,
    },
    agreementText: {
        height: Dimensions.get("window").height*0.0272,
    },
    button: {
        borderColor: '#5505BA',
        borderWidth: 1,
        borderRadius: 15,
        height: '7%',
        marginVertical:'10%',
        width: '25%',
        backgroundColor: '#5505BA',
        alignItems:'center',
    },
    buttonText: {
        height: Dimensions.get("window").height*0.0476,
        fontSize: Dimensions.get("window").width*0.0845,
        color: 'white',
    }
})