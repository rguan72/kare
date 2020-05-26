import {
  getGroupsById,
  addGroupsToUser,
  removeGroupFromUser,
  deleteConnector,
  getGroups,
} from "../utils/FirebaseUtils";
import * as Analytics from "expo-firebase-analytics";

export async function getGroupsFromDb(dispatch, groups: any) {
  console.log("action group");
  try {
    getGroupsById(groups).then((fetchedGroups) => {
      dispatch({
        type: "GET_GROUPS",
        payload: fetchedGroups,
      });
      Analytics.setUserProperty(
        "communitiesJoined",
        fetchedGroups.length.toString()
      );
    });
  } catch (err) {
    console.log(err);
  }
}

export function addGroups(dispatch, groups) {
  getGroupsById(groups).then((groupList) => {
    dispatch({
      type: "ADD_GROUPS",
      payload: groupList,
    });
  });
  addGroupsToUser(groups);
}

export function removeGroups(dispatch, userId: string, groupId) {
  getGroupsById([groupId]).then((group) => {
    console.log(group);
    dispatch({
      type: "REMOVE_GROUP",
      payload: group[0], // since it gets returned as an array
    });
  });
  removeGroupFromUser(groupId);
  deleteConnector(userId, groupId);
}

export async function getAllGroups(dispatch) {
  getGroups().then((groupList) => {
    const groups = [];
    groupList.forEach((group) => {
      groups.push({ id: group.id, ...group.data() });
    });
    dispatch({
      type: "ALL_GROUPS",
      payload: groups,
    });
  });
}
