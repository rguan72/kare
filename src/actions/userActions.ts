import {
  getUser,
  followComment,
  unfollowComment,
} from "../utils/FirebaseUtils";
import { getGroupsFromDb } from "./groupActions";

export async function getUserFromDb(dispatch, userId) {
  try {
    getUser(userId).then((dbUser) => {
      console.log("action user");
      dispatch({
        type: "GET_USER",
        payload: dbUser,
      });
      getGroupsFromDb(dispatch, dbUser.groups);
    });
  } catch (err) {
    console.log(err);
  }
}

export async function addFollowing(dispatch, commentId, userId) {
  console.log("adding");
  dispatch({ type: "ADD_FOLLOWING", payload: commentId });
  followComment(commentId, userId);
}

export async function removeFollowing(dispatch, commentId, userId) {
  console.log("removing");
  dispatch({ type: "REMOVE_FOLLOWING", payload: commentId });
  unfollowComment(commentId, userId);
}

export async function addNotificationId(dispatch, notificationId) {
  dispatch({ type: "ADD_NOTIFICATION_ID", payload: notificationId });
}
