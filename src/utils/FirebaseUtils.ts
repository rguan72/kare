import firebaseApp, { auth } from "firebase/app";
import firebase from "../constants/Firebase";
import { Linking } from "expo";
import { AsyncStorage } from "react-native";
import { CommonActions } from "@react-navigation/native";
import { collections } from "../constants/FirebaseStrings";
import { community } from "../constants/community";
import { func } from "prop-types";
import screens from "../constants/screenNames";

const db = firebase.firestore();
const imageStorage = firebase.storage();

interface comment {
  userId: String;
  text: String;
  reports: Number;
  numReplies: Number;
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

enum AuthState {
  loggedin,
  emailverify,
  loggedout,
}

function getCurrentUser() {
  return firebaseApp.auth().currentUser;
}

function sendVerificationEmail() {
  const user = getCurrentUser();
  // TODO: Deep linking with Firebase Dynamic Linking
  const actionCodeSettings = {
    url: "https://codenames.co",
    iOS: {
      bundleId: "com.kare.kare",
    },
    android: {
      packageName: "com.kare.kare",
      installApp: true,
      minimumVersion: "12",
    },
    handleCodeInApp: true,
  };
  console.log(user);
  if (user) {
    user.sendEmailVerification().catch((error) => console.log(error));
  } else {
    console.log("user not signed in");
  }
}

async function addUser(email: string, password: string) {
  await firebaseApp.auth().createUserWithEmailAndPassword(email, password);
  const user = firebaseApp.auth().currentUser;
  db.collection(collections.users)
    .doc(user.uid)
    .set({ timestamp: firebaseApp.firestore.FieldValue.serverTimestamp() });
}

function addComment(comment: comment) {
  db.collection(collections.comments)
    .doc()
    .set({
      timestamp: firebaseApp.firestore.FieldValue.serverTimestamp(),
      numReplies: 0,
      parentId: "",
      ...comment,
    });
}

function addReply(commentId, comment: comment) {
  db.collection(collections.comments) // add a new comment
    .add({
      timestamp: firebaseApp.firestore.FieldValue.serverTimestamp(),
      numReplies: 0,
      parentId: commentId,
      ...comment,
    })
    .then((ref) => {
      db.collection(collections.comments) // then go into parent comment and update num replies and reply array
        .doc(commentId)
        .update({
          numReplies: firebaseApp.firestore.FieldValue.increment(1),
          replies: firebaseApp.firestore.FieldValue.arrayUnion(ref.id),
        });
    });
}

function reportComment(id: string) {
  var comment = db.collection(collections.comments).doc(id);
  comment.update({ show: false });
  comment.get().then((badComment) => {
    if (badComment.data().parentId) {
      db.collection(collections.comments)
        .doc(badComment.data().parentId)
        .update({
          numReplies: firebaseApp.firestore.FieldValue.increment(-1),
          replies: firebaseApp.firestore.FieldValue.arrayRemove(badComment.id),
        });
    }
  });
}

function watchComments(setComments) {
  return db
    .collection(collections.comments)
    .where("parentId", "==", "")
    .where("show", "==", true)
    .orderBy("timestamp", "asc")
    .onSnapshot((querySnapshot) => {
      const comments = [];
      querySnapshot.forEach((doc) => {
        comments.unshift({
          id: doc.id,
          ...doc.data(),
        });
      });
      setComments(comments);
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
        comments.unshift({
          id: doc.id,
          ...doc.data(),
        });
      });
      return comments;
    });
}

function watchReplies(commentId, setReplies) {
  return db
    .collection(collections.comments)
    .where("parentId", "==", commentId)
    .where("show", "==", true)
    .orderBy("timestamp", "asc")
    .onSnapshot((querySnapshot) => {
      const replies = [];
      querySnapshot.forEach((doc) => {
        replies.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setReplies(replies);
    });
}

function getUser(id) {
  return db
    .collection(collections.users)
    .doc(id)
    .get()
    .then((ref) => ref.data());
}

function watchGroups(setGroups) {
  return db.collection(collections.groups).onSnapshot((querySnapshot) => {
    const groups = [];
    querySnapshot.forEach((doc) => groups.push({ id: doc.id, ...doc.data() }));
    return setGroups(groups);
  });
}

function onAuthUserListener(next, fallback) {
  firebaseApp.auth().onAuthStateChanged((authUser) => {
    if (authUser) {
      db.collection(collections.users)
        .doc(authUser.uid)
        .get()
        .then((user) => {
          const dbUser = user.data();
          const mergedUser = {
            uid: authUser.uid,
            email: authUser.email,
            emailVerified: authUser.emailVerified,
            providerData: authUser.providerData,
            ...dbUser,
          };
          if (authUser.emailVerified) next(mergedUser);
          // else notVerifiedFunc(mergedUser);
        });
    } else {
      fallback();
    }
  });
}

function authNav(navigation, expectedState: AuthState) {
  function navHome() {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: screens.home }],
      })
    );
  }

  function navVerifyEmail() {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: screens.verifyEmail }],
      })
    );
  }

  function navSignup() {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: screens.signup }],
      })
    );
  }

  firebaseApp.auth().onAuthStateChanged((authUser) => {
    let currentState;
    if (authUser) {
      if (authUser.emailVerified) currentState = AuthState.loggedin;
      else currentState = AuthState.emailverify;
    } else {
      currentState = AuthState.loggedout;
    }
    if (expectedState !== currentState) {
      if (currentState === AuthState.emailverify) navVerifyEmail();
      else if (currentState === AuthState.loggedin) navHome();
      else navSignup();
    }
  });
}

export {
  addComment,
  watchComments,
  reportComment,
  watchGroups,
  getUser,
  addUser,
  watchReplies,
  addReply,
  getUserComments,
  sendVerificationEmail,
  getCurrentUser,
  onAuthUserListener,
  AuthState,
  authNav,
};
