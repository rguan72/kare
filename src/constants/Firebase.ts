import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/analytics";

// const firebaseConfig = {
//   apiKey: "AIzaSyCtTpKft_RsbH1qkIM0njqldFGjNxbt1ZA",
//   authDomain: "kare-e7658.firebaseapp.com",
//   databaseURL: "https://kare-e7658.firebaseio.com",
//   projectId: "kare-e7658",
//   storageBucket: "kare-e7658.appspot.com",
//   messagingSenderId: "937287042472",
//   appId: "1:937287042472:web:a5e19adb63a43493ce499d",
//   measurementId: "G-5P446VYGX1"
// };
// var firebaseConfig = {
//   apiKey: "AIzaSyCUaax1geb6fwvoLwoNGDtznD21WJfT1Qo",
//   authDomain: "kare-2.firebaseapp.com",
//   databaseURL: "https://kare-2.firebaseio.com",
//   projectId: "kare-2",
//   storageBucket: "kare-2.appspot.com",
//   messagingSenderId: "30311250888",
//   appId: "1:30311250888:web:ead3c22b752fc785ed5efd"
// };

var firebaseConfig = {
  apiKey: "AIzaSyAWPbEf57Sj8zWT1fMPv1Sgyvjo6bmis-4",
  authDomain: "kare-3.firebaseapp.com",
  databaseURL: "https://kare-3.firebaseio.com",
  projectId: "kare-3",
  storageBucket: "kare-3.appspot.com",
  messagingSenderId: "777284393355",
  appId: "1:777284393355:web:53e7c0b1ffb9fc11c7378e",
  measurementId: "G-FSL56NGH61",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export default firebase.app();
