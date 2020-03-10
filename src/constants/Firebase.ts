import * as firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCtTpKft_RsbH1qkIM0njqldFGjNxbt1ZA",
  authDomain: "kare-e7658.firebaseapp.com",
  databaseURL: "https://kare-e7658.firebaseio.com",
  projectId: "kare-e7658",
  storageBucket: "kare-e7658.appspot.com",
  messagingSenderId: "937287042472",
  appId: "1:937287042472:web:a5e19adb63a43493ce499d",
  measurementId: "G-5P446VYGX1"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export default firebase.app();
