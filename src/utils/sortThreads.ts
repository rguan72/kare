function sortThreads(threads) {
  var thread_scores = {};
  var sorted_threads = [];
  var sorted_threads_str = [];
  var count = 0;
  for (let thread of threads) {
    if (!(thread["timestamp"] && thread["latestReplyTimestamp"])){
      thread_scores[count] = 110;
      count = count + 1;
      continue;
    }

    // gives a score of 0 if comment is older than 7 days (604,800 seconds)
    // otherwise, gives a score between 0 and 50
    var timestamp_score = 
      50-((((Date.now()/1000)-
      thread["timestamp"]["seconds"])/604800.0) * 50);
    if (timestamp_score < 0) {
      timestamp_score = 0;
    }

    // gives score of 0 if latest reply is over 14 days (1210000 secs) old
    // if numReplies = 0, we use the timestamp of the comment instead
    // otherwise, gives a score between 0 and 50
    if (thread["latestReplyTimestamp"]) {
      var reply_time_score = 
        50-((((Date.now()/1000)-
        thread["latestReplyTimestamp"]["seconds"])/1210000.0) * 50);
    } else {
      var reply_time_score = 
        50-((((Date.now()/1000)-
        thread["timestamp"]["seconds"])/1210000.0) * 50);
    }
    if (reply_time_score < 0) {
      reply_time_score = 0;
    }

    var replies_score = (parseInt(thread["numReplies"])/50.0) * 10;

    var score = timestamp_score + reply_time_score + replies_score;

    thread_scores[count] = score;
    count = count + 1;
  }
  sorted_threads_str = 
    Object.keys(thread_scores).sort(function(a,b){return thread_scores[b]-
    thread_scores[a]});
  

  for (var i=0; i < sorted_threads_str.length; i++) {
    sorted_threads.push(threads[parseInt(sorted_threads_str[i])]);
  }

  return sorted_threads;
}

export { sortThreads };