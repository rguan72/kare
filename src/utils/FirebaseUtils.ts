import firebase from "../constants/Firebase";
import { collections } from "../constants/FirebaseStrings";

const db = firebase.firestore();

interface comment {
  user: String;
  text: String;
}

interface commentList {
  [index: number]: comment;
}

function addComment(comment: comment) {
  db.collection(collections.comments)
    .doc()
    .set(comment);
}

function getComments(): Promise<commentList> {
  return db
    .collection(collections.comments)
    .get()
    .then(querySnapshot => {
      const comments = [];
      querySnapshot.forEach(doc => comments.push(doc.data()));
      return comments;
    });
}

export { addComment, getComments };
