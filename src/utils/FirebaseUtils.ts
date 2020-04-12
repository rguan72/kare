import firebaseApp from "firebase/app";
import firebase from "../constants/Firebase";
import { collections } from "../constants/FirebaseStrings";
import { community } from "../constants/community";

const db = firebase.firestore();

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
  console.log("getComments read");
  return db
    .collection(collections.comments)
    .where("parentId", "==", "")
    .where("show", "==", true)
    .orderBy("timestamp", "asc")
    .onSnapshot((querySnapshot) => {
      const comments = [];
      querySnapshot.forEach((doc) => {
        comments.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setComments(comments);
    });
}

function getUserComments(user) {
  console.log("getUserComments read");
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
  console.log("getUser read");
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

function watchGroups(setGroups) {
  console.log("getGroups read");
  return db
    .collection(collections.groups)
    .get()
    .then((querySnapshot) => {
      const groups = [];
      querySnapshot.forEach((doc) =>
        groups.push({ id: doc.id, ...doc.data() })
      );
      return setGroups(groups);
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
};
