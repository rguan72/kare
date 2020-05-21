import { getUser } from "../utils/FirebaseUtils";

export async function getUserFromDb(dispatch, userId) {
  try {
    getUser(userId).then((dbUser) => {
      dispatch({
        type: "GET_USER",
        payload: dbUser,
      });
    });
  } catch (err) {
    console.log(err);
  }
}

export async function addFollowing(dispatch, commentId) {
  dispatch({ type: "ADD_FOLLOWING", payload: commentId });
}

export async function removeFollowing(dispatch, commentId) {
  dispatch({ type: "REMOVE_FOLLOWING", payload: commentId });
}
