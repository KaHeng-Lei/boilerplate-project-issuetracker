const mongoose = require("mongoose");
const { Schema } = mongoose;

const issueSchema = new Schema({
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_by: { type: String, required: true },
  assigned_to: String,
  status_text: String,
  created_on: Date,
  updated_on: Date,
  open: { type: Boolean, default: true },
  project: String,
});

const IssueModel = mongoose.model("Issue", issueSchema);

exports.IssueModel = IssueModel;
