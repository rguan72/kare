import firebaseApp from "firebase/app";
import firebase from "../constants/Firebase";
import { collections } from "../constants/FirebaseStrings";
import { community } from "../constants/community";

const db = firebase.firestore();

interface comment {
  userId: String;
  text: String;
  reports: Number;
  show: Boolean;
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
      ...comment
    });
}

function reportComment(id: string) {
  db.collection(collections.comments)
    .doc(id)
    .update({
      show: false
    });
}

function monitorComments(setComments) {
  return db
    .collection(collections.comments)
    .where("show", "==", true)
    .onSnapshot(querySnapshot => {
      const comments = [];
      querySnapshot.forEach(doc => {
        comments.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setComments(comments);
    });
}

function getUser(id) {
  return db
    .collection(collections.users)
    .doc(id)
    .get()
    .then(ref => ref.data());
}

function getGroups() {
  return db
    .collection(collections.groups)
    .get()
    .then(querySnapshot => {
      const groups = [];
      querySnapshot.forEach(doc => groups.push({ id: doc.id, ...doc.data() }));
      return groups;
    });
}

export { addComment, monitorComments, reportComment, getGroups, getUser };
