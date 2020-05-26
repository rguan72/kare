export function connectorReducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case "GET_CONNECTORS":
      return { ...state, ...payload };
    case "ON_OPEN":
      state[payload] = 0;
      return { ...state };
    case "ADD_CONNECTOR":
      return { ...state, ...payload };
    case "REMOVE_CONNECTOR":
      delete state[payload];
      return { ...state };
    default:
      return state;
  }
}
