import firebaseApp from "firebase/app";
import firebase from "../constants/Firebase";
import { Linking } from "expo";
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
function getCurrentUser() {
  return firebaseApp.auth().currentUser;
}

function sendVerificationEmail() {
  const user = getCurrentUser();
  console.log(user);
  if (user) {
    user
      .sendEmailVerification({
        url: Linking.makeUrl(),
      })
      .catch((error) => console.log(error));
  } else {
    console.log("user not signed in");
  }
}

function addUser(email: string, password: string) {
  return firebaseApp.auth().createUserWithEmailAndPassword(email, password);
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

// function addUser(user) {
//   db.collection(collections.users)
//     .doc()
//     .set({
//       timestamp: firebaseApp.firestore.FieldValue.serverTimestamp(),
//       ...user,
//     });
// }

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
  getCurrentUser,
};
