import firebaseApp from "firebase/app";
import firebase from "../constants/Firebase";
import { collections } from "../constants/FirebaseStrings";
import { NewComment, User, UserWithId } from "../Models";
import Report from "../constants/Report";

const db = firebase.firestore();
const imageStorage = firebase.storage();

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

function sendPasswordResetEmail(email: string) {
  var auth = firebaseApp.auth();
  auth
    .sendPasswordResetEmail(email)
    .then(function () {})
    .catch(function (error) {
      console.log(error);
    });
}
async function addNotifTokenToUser(id, token) {
  db.collection(collections.users).doc(id).update({ notificationId: token });
}

async function addUser(email: string, password: string) {
  await firebaseApp.auth().createUserWithEmailAndPassword(email, password);
  const user = firebaseApp.auth().currentUser;
  db.collection(collections.users)
    .doc(user.uid)
    .set({ timestamp: firebaseApp.firestore.FieldValue.serverTimestamp() });
}

function setUserGroups(allUserInformation) {
  const user = firebaseApp.auth().currentUser;
  db.collection(collections.users).doc(user.uid).update(allUserInformation);
  allUserInformation["groups"].forEach((group) => {
    db.collection(collections.groups)
      .doc(group)
      .update({ num_members: firebaseApp.firestore.FieldValue.increment(1) });
    createConnector(user.uid, group);
  });
}

function addGroupsToUser(newGroups) {
  /*
  This function is used to add the groups that the user selects on setup to
  his/her profile. Should only be called once to make sure we do not double
  count the users group membership 
   */
  const user = firebaseApp.auth().currentUser;
  newGroups.forEach((doc) => {
    db.collection(collections.users)
      .doc(user.uid)
      .update({ groups: firebaseApp.firestore.FieldValue.arrayUnion(doc) });
    db.collection(collections.groups)
      .doc(doc)
      .update({ num_members: firebaseApp.firestore.FieldValue.increment(1) });
    createConnector(user.uid, doc);
  });
}

function deleteComment(commentId) {
  db.collection(collections.comments).doc(commentId).delete();
}

function removeGroupFromUser(group) {
  const user = firebaseApp.auth().currentUser;
  db.collection(collections.users)
    .doc(user.uid)
    .update({ groups: firebaseApp.firestore.FieldValue.arrayRemove(group) });
  db.collection(collections.groups)
    .doc(group)
    .update({ num_members: firebaseApp.firestore.FieldValue.increment(-1) });
}

function addComment(comment: NewComment, groupId) {
  db.collection(collections.comments)
    .doc()
    .set({
      timestamp: firebaseApp.firestore.FieldValue.serverTimestamp(),
      numReplies: 0,
      parentId: "",
      groupId: groupId,
      followers: [],
      ...comment,
    });
}

function addReply(commentId, comment: Comment) {
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
	  latestReplyTimestamp: firebaseApp.firestore.FieldValue.serverTimestamp(),
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
function addReport(report: Report) {
  db.collection(collections.reports).doc().set({
    timestamp: firebaseApp.firestore.FieldValue.serverTimestamp(),
    reporterID: report.reporterID,
    reporteeID: report.reporteeID,
    comment: report.comment,
    commentRef: report.commentRef,
    helpFlag: report.helpFlag,
    inappropriateFlag: report.inappropriateFlag,
    spamFlag: report.spamFlag,
  });
  reportComment(report.commentRef);
}
function watchComments(setComments, groupId, setCommentsLoading) {
  return db
    .collection(collections.comments)
    .where("parentId", "==", "")
    .where("show", "==", true)
    .where("groupId", "==", groupId)
    .onSnapshot((querySnapshot) => {
      const comments = [];
      querySnapshot.forEach((doc) => {
        comments.unshift({
          id: doc.id,
          ...doc.data({serverTimestamps: 'estimate'}),
        });
      });
      setComments(comments);
      setCommentsLoading(false);
    });
}

async function getComment(commentId) {
  const data = (
    await db.collection(collections.comments).doc(commentId).get()
  ).data();
  return data;
}

async function followComment(commentId: string, userId: string) {
  db.collection(collections.comments)
    .doc(commentId)
    .update({
      followers: firebaseApp.firestore.FieldValue.arrayUnion(userId),
    });
  db.collection(collections.users)
    .doc(userId)
    .update({
      comments_following: firebaseApp.firestore.FieldValue.arrayUnion(
        commentId
      ),
    });
}

async function unfollowComment(commentId: string, userId: string) {
  db.collection(collections.comments)
    .doc(commentId)
    .update({
      followers: firebaseApp.firestore.FieldValue.arrayRemove(userId),
    });
  db.collection(collections.users)
    .doc(userId)
    .update({
      comments_following: firebaseApp.firestore.FieldValue.arrayRemove(
        commentId
      ),
    });
}

/* 
isFollowing is a boolean of if the user is currently following the post
commentId is the id of the comment
userId is the id of the user
setFollowing is the set state function for following
*/
async function manageFollowing(
  isFollowing: boolean,
  commentId: string,
  userId: string,
  setFollowing
) {
  if (isFollowing) {
    unfollowComment(commentId, userId);
    setFollowing(false);
  } else {
    followComment(commentId, userId);
    setFollowing(true);
  }
}

async function manageFollowingComment(
  isFollowing: boolean,
  commentId: string,
  userId: string
) {
  if (isFollowing) {
    unfollowComment(commentId, userId);
  } else {
    followComment(commentId, userId);
  }
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

function watchReplies(commentId, setReplies, setLoading) {
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
      setLoading(false);
    });
}

// not sure how to get correct Typescript return type
async function getUser(id): Promise<UserWithId> {
  return db
    .collection(collections.users)
    .doc(id)
    .get()
    .then((ref) => {
      return { ...ref.data(), id: ref.id };
    });
}

function watchGroups(setGroups) {
  // useful for getting the URL for new groups.
  // imageStorage.refFromURL("gs://kare-3.appspot.com/Sports.png").getDownloadURL().then(url => {
  //     console.log(url);
  //   })
  return db.collection(collections.groups).onSnapshot((querySnapshot) => {
    const groups = [];
    querySnapshot.forEach((doc) => groups.push({ id: doc.id, ...doc.data() }));
    return setGroups(groups);
  });
}

async function getGroupsById(groupIds: Array<string>) {
  return Promise.all(
    groupIds.map((id) =>
      db
        .collection(collections.groups)
        .doc(id)
        .get()
        .then((ref) => ({ id: ref.id, ...ref.data() }))
    )
  );
}

async function getGroups() {
  return db.collection(collections.groups).get();
}

function onAuthUserListener(next, fallback, notVerifiedFunc) {
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
          else notVerifiedFunc(mergedUser);
        });
    } else {
      fallback();
    }
  });
}

function editComment(commentId: string, newText: string) {
  db.collection(collections.comments).doc(commentId).update({
    text: newText,
  });
}

async function editCommentsFields() {
  /*Function used to add fields to all comments*/
  db.collection(collections.comments)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach(async (doc) => {
        try {
          await db.collection(collections.comments).doc(doc.id).update({
            //whatever fields you want to edit
          });
        } catch (err) {
          console.log(err);
        }
      });
    });
}

async function addReplyTimestamp() {
  /*Function used to add latest reply field to all comments with numReplies > 0 */
  db.collection(collections.comments)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach(async (doc) => {
        try {
          const replies = doc.data().replies;
	  var timestamp;
	  var start = 1;
	  for(let reply of replies) {
	    await db.collection(collections.comments).doc(reply)
	    .get()
	    .then(function(doc) {
	      if (start === 1 && doc.data().timestamp){
		start = 0;
		timestamp = doc.data().timestamp;
	      }
	      if (doc.data().timestamp && doc.data().timestamp > timestamp){
	        timestamp = doc.data().timestamp;
	      }
	    });
	  }
	  if ((replies.length > 0)){
            await db.collection(collections.comments).doc(doc.id).update({
              latestReplyTimestamp: timestamp,
	    });
  	  }
        } catch (err) {
          console.log(err);
        }
      });
    });
}

/*
Makes group connectors between all user-group pairs
Should only be called once
*/
async function makeGroupConnectors() {
  db.collection(collections.users)
    .get()
    .then((snapshot) => {
      snapshot.forEach(async (doc) => {
        try {
          const userId = doc.id;
          const groups = doc.data().groups;
          groups.forEach((group) => {
            db.collection(collections.groupConnectors).doc().set({
              userId: userId,
              groupId: group,
              commentsSince: 0,
            });
          });
        } catch (err) {
          console.log(err);
        }
      });
    });
}

async function createConnector(userId: string, groupId: string) {
  db.collection(collections.groupConnectors).doc().set({
    userId,
    groupId,
    commentsSince: 0,
  });
}

async function deleteConnector(userId: string, groupId: string) {
  return db
    .collection(collections.groupConnectors)
    .where("groupId", "==", groupId)
    .where("userId", "==", userId)
    .get()
    .then((res) => {
      res.docs.forEach((doc) => {
        db.collection(collections.groupConnectors).doc(doc.id).delete();
      });
    });
}

// Gets new comments since last open
async function getCommentsSince(userId: string) {
  return db
    .collection(collections.groupConnectors)
    .where("userId", "==", userId)
    .get()
    .then((res) => {
      const groupValues = {};
      res.forEach((doc) => {
        //groupValues.unshift(doc.data());
        groupValues[doc.data().groupId] = doc.data().commentsSince;
      });
      return groupValues;
    });
}

// called when comment is made.. increments each group connector by 1
async function incrementGroupConnectors(groupId: string) {
  var count = 0;
  db.collection(collections.groupConnectors)
    .where("groupId", "==", groupId)
    .get()
    .then((res) => {
      let batch = db.batch();
      res.docs.forEach((doc) => {
        const ref = db.collection(collections.groupConnectors).doc(doc.id);
        batch.update(ref, {
          commentsSince: firebaseApp.firestore.FieldValue.increment(1),
        });
      });
      batch.commit();
    });
}

// sets commentsSince to 0 to show you opened a group
async function onGroupOpen(groupId: string, userId: string) {
  return db
    .collection(collections.groupConnectors)
    .where("groupId", "==", groupId)
    .where("userId", "==", userId)
    .get()
    .then((res) => {
      res.docs.forEach((doc) => {
        db.collection(collections.groupConnectors)
          .doc(doc.id)
          .update({ commentsSince: 0 });
      });
    });
}

export {
  makeGroupConnectors,
  addComment,
  watchComments,
  reportComment,
  watchGroups,
  getUser,
  addUser,
  watchReplies,
  addReply,
  addReport,
  getUserComments,
  sendVerificationEmail,
  sendPasswordResetEmail,
  getCurrentUser,
  onAuthUserListener,
  setUserGroups,
  getGroups,
  getGroupsById,
  addNotifTokenToUser,
  addGroupsToUser,
  removeGroupFromUser,
  incrementGroupConnectors,
  onGroupOpen,
  getComment,
  manageFollowing,
  followComment,
  manageFollowingComment,
  editComment,
  editCommentsFields,
  deleteComment,
  addReplyTimestamp,
  createConnector,
  deleteConnector,
  getCommentsSince,
};
