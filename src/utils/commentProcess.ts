function commentProcess(comment) {
  comment = comment.toLowerCase().replace(/[’]/g, "");
  console.log(comment);
  return comment;
}

export { commentProcess };
