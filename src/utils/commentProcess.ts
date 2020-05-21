function commentProcess(comment) {
  comment = comment.toLowerCase().replace(/[’']/g, "");
  return comment;
}

export { commentProcess };
