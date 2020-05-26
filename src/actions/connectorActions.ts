import { getCommentsSince, onGroupOpen } from "../utils/FirebaseUtils";

export function getConnectorsFromDb(dispatch, userId: string) {
  getCommentsSince(userId).then((connectors) => {
    dispatch({
      type: "GET_CONNECTORS",
      payload: connectors,
    });
  });
}

export function openGroup(dispatch, userId: string, groupId: string) {
  dispatch({
    type: "ON_OPEN",
    payload: groupId,
  });
  onGroupOpen(groupId, userId);
}

export function addConnector(dispatch, groups) {
  const groupList = {};
  groups.forEach((group) => {
    groupList[group.id] = 0;
  });

  dispatch({
    type: "ADD_CONNECTOR",
    payload: groupList,
  });
}

export function removeConnector(dispatch, groupId: string) {
  dispatch({
    type: "REMOVE_CONNECTOR",
    payload: groupId,
  });
}
