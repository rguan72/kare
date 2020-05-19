export default class Report { 
    reporterID: string;
    reporteeID: string;
    comment: string;
    commentRef: string;
    helpFlag: boolean;
    inappropriateFlag: boolean;
    spamFlag: boolean;
    constructor(reporterID_, reporteeID_, comment_, commentRef_, helpFlag_, inappropriateFlag_, spamFlag_) {
        this.reporterID = reporterID_;
        this.reporteeID = reporteeID_;
        this.comment = comment_;
        this.commentRef = commentRef_;
        this.helpFlag = helpFlag_;
        this.inappropriateFlag = inappropriateFlag_;
        this.spamFlag = spamFlag_;
    }
  }