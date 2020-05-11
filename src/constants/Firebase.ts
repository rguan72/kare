import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";

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
