import firebaseApp from "firebase/app";
import firebase from "../constants/Firebase";
import { AsyncStorage } from "react-native";
import { collections } from "../constants/FirebaseStrings";
import { community } from "../constants/community";

const db = firebase.firestore();

interface comment {
  userId: String;
  text: String;
  reports: Number;
  show: Boolean;
}

interface user {
  userName: String;
  color: String;
}

interface returnComment extends comment {
  id: String;
}

interface commentList {
  [index: number]: returnComment;
}

function sendVerificationEmail(email: string) {
  console.log("sendVerification");
  let actionCodeSettings = {
    canHandleCodeInApp: false,
    url: "kare-3.firebaseapp.com",
    handleCodeInApp: true,
    iOS: {
      bundleId: "com.kare.ios",
    },
    android: {
      packageName: "com.kare.android",
      installApp: true,
      minimumVersion: "12",
    },
    dynamicLinkDomain: "example.page.link",
  };

  firebaseApp
    .auth()
    .sendSignInLinkToEmail(email, actionCodeSettings)
    .then(async () => {
      await AsyncStorage.setItem("emailForSignIn", email);
    })
    .catch((error) => {
      console.log(error);
    });
}

function addComment(comment: comment) {
  db.collection(collections.comments)
    .doc()
    .set({
      timestamp: firebaseApp.firestore.FieldValue.serverTimestamp(),
      ...comment,
    });
}

function reportComment(id: string) {
  db.collection(collections.comments).doc(id).update({
    show: false,
  });
}

function getComments() {
  return db
    .collection(collections.comments)
    .where("show", "==", true)
    .orderBy("timestamp", "asc")
    .get()
    .then((querySnapshot) => {
      const comments = [];
      querySnapshot.forEach((doc) => {
        comments.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      return comments;
    });
}

function getUserComments(user) {
  return db
    .collection(collections.comments)
    .where("userId", "==", user)
    .where("show", "==", true)
    .orderBy("timestamp", "asc")
    .get()
    .then((querySnapshot) => {
      const comments = [];
      querySnapshot.forEach((doc) => {
        comments.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      return comments;
    });
}

function getUser(id) {
  return db
    .collection(collections.users)
    .doc(id)
    .get()
    .then((ref) => ref.data());
}

function addUser(user) {
  db.collection(collections.users)
    .doc()
    .set({
      timestamp: firebaseApp.firestore.FieldValue.serverTimestamp(),
      ...user,
    });
}

function getGroups() {
  return db
    .collection(collections.groups)
    .get()
    .then((querySnapshot) => {
      const groups = [];
      querySnapshot.forEach((doc) =>
        groups.push({ id: doc.id, ...doc.data() })
      );
      return groups;
    });
}

export {
  addComment,
  getComments,
  reportComment,
  getGroups,
  getUser,
  addUser,
  getUserComments,
  sendVerificationEmail,
};
