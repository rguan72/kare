import firebase from "../constants/Firebase";

class Analytics {
  logSignup() {
    firebase.analytics().logEvent("signup");
  }
  logComment() {
    firebase.analytics().logEvent("comment");
  }
}

const analytics = new Analytics();
export default analytics;
