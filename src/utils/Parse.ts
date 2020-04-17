function getEmailExtension(email: string) {
  return email.split("@")[1];
}

export { getEmailExtension };
