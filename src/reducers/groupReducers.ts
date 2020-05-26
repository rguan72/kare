export function groupReducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case "GET_GROUPS":
      return { ...state, userGroups: payload };
    case "ADD_GROUPS":
      return {
        allGroups: state.allGroups.filter((group) => {
          // filters out all groups not in payload
          return (
            payload.filter((doc) => {
              return group.id === doc.id;
            }).length === 0
          );
        }),
        userGroups: [...payload, ...state.userGroups],
      };
    case "REMOVE_GROUP":
      console.log(state.userGroups.filter((group) => group.id !== payload.id));
      return {
        allGroups: state.allGroups.concat(payload),
        userGroups: state.userGroups.filter((group) => group.id !== payload.id),
      };
    case "ALL_GROUPS":
      // returns all groups that are not in userGroups
      return {
        ...state,
        allGroups: payload.filter((element) => {
          return (
            state.userGroups.filter((group) => {
              return group.id === element.id;
            }).length === 0
          );
        }),
      };
    default:
      return state;
  }
}
