export function userReducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case "GET_USER":
      console.log("reduce user");
      return { ...state, ...payload };
    case "ADD_FOLLOWING":
      console.log("in reducer");
      if (state.user.comments_following.indexOf(payload)) {
        console.log(state.user.comments_following.indexOf(payload));
        state.comments_following.unshift(payload);
      }
      console.log(state);
      return { ...state };
    case "REMOVE_FOLLOWING":
      let index = state.comments_following.indexOf(payload);
      state.comments_following.splice(index, 1);
      return { ...state };
    case "ADD_NOTIFICATION_ID":
      return { ...state, ...payload }; // payload is the notif ID
    default:
      return state;
  }
}
