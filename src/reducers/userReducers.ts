export function userReducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case "GET_USER":
      return { ...state, ...payload };
    case "ADD_FOLLOWING":
      if (state.comments_following.indexOf(payload)) {
        state.comments_following.unshift(payload);
      }
      return { ...state };
    case "REMOVE_FOLLOWING":
      let index = state.comments_following.indexOf(payload);
      state.comments_following.splice(index, 1);
      return { ...state };
    case "ADD_NOTIFICATION_ID":
      return { ...state, notificationId: payload }; // payload is the notif ID
    default:
      return state;
  }
}
