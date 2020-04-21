import whiteList from "../constants/emailWhitelist";

function getEmailExtension(email: string) {
  console.log(email);
  return email.split("@")[1];
}

function emailValid(email: string) {
  return whiteList.includes(getEmailExtension(email));
}

export { getEmailExtension, emailValid };
