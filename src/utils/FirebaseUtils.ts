import firebaseApp from "firebase/app";
import firebase from "../constants/Firebase";
import { collections } from "../constants/FirebaseStrings";
import { community } from "../constants/community";

const db = firebase.firestore();

interface comment {
  user: String;
  text: String;
  likes: Number;
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

function likeComment(ref: string) {
  const updateObj = {
    likes: firebaseApp.firestore.FieldValue.increment(1),
    show: true
  };
  const like = async () => {
    const data = await db
      .collection(collections.comments)
      .doc(ref)
      .get()
      .then(doc => doc.data());
    if (data.likes + 1 < community.reportCutoff) {
      updateObj.show = false;
    }
    db.collection(collections.comments)
      .doc(ref)
      .update(updateObj);
  };
  like();
}

function dislikeComment(ref: string) {
  const updateObj = {
    likes: firebaseApp.firestore.FieldValue.increment(-1),
    show: true
  };
  const dislike = async () => {
    const data = await db
      .collection(collections.comments)
      .doc(ref)
      .get()
      .then(doc => doc.data());
    if (data.likes - 1 < community.reportCutoff) {
      updateObj.show = false;
    }
    db.collection(collections.comments)
      .doc(ref)
      .update(updateObj);
  };
  dislike();
}

function monitorComments(setComments) {
  return db
    .collection(collections.comments)
    .where("show", "==", true)
    .onSnapshot(querySnapshot => {
      const comments = [];
      querySnapshot.forEach(doc =>
        comments.push({ id: doc.id, ...doc.data() })
      );
      setComments(comments);
    });
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

export { addComment, monitorComments, likeComment, dislikeComment, getGroups };
