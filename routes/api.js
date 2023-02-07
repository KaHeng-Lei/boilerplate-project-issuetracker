"use strict";
const mongoose = require("mongoose");
const IssueModel = require("../models.js").IssueModel;

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;
      //?open=true&assigned_to=ted
      let filterObject = Object.assign(req.query);
      filterObject["project"] = project;

      IssueModel.find(filterObject, (err, data) => {
        if (!err && data) {
          return res.json(data);
        }
      });
    })

    .post(function (req, res) {
      let project = req.params.project;

      const { issue_title, issue_text, created_by, assigned_to, status_text } =
        req.body;

      if (!issue_title || !issue_text || !created_by) {
        res.json({ error: "required field(s) missing" });
        return;
      }

      const newIssue = new IssueModel({
        issue_title,
        issue_text,
        created_by,
        assigned_to: assigned_to || "",
        status_text: status_text || "",
        created_on: new Date(),
        updated_on: new Date(),
        open: true,
        project,
      });
      newIssue.save((err, savedIssue) => {
        if (!err && savedIssue) {
          return res.json(newIssue);
        }
      });
    })

    .put(function (req, res) {
      let project = req.params.project;
      console.log("update fields: ");
      console.log(req.body);
      if (!req.body._id) {
        return res.json({ error: "missing _id" });
      }
      // we want to filter out any undefined fields
      // issue_text: '', created_by: 'khl'
      let updateObject = {};
      Object.keys(req.body).forEach((key) => {
        if (req.body[key] != "") {
          updateObject[key] = req.body[key];
        }
      });
      if (Object.keys(updateObject).length < 2) {
        return res.json({
          error: "no update field(s) sent",
          _id: req.body._id,
        });
      }
      updateObject["updated_on"] = new Date().toUTCString();
      IssueModel.findByIdAndUpdate(
        req.body._id,
        updateObject,
        { new: true },
        (err, updatedIssue) => {
          if (err || !updatedIssue) {
            res.json({ error: "could not update", _id: req.body._id });
          } else {
            console.log("Updated issue: " + updatedIssue);
            res.json({ result: "successfully updated", _id: req.body._id });
          }
        }
      );
    })

    .delete(function (req, res) {
      let _id = req.body._id;
      if (!_id) {
        return res.json({ error: "missing _id" });
      }
      IssueModel.findByIdAndRemove(_id, (err, deletedIssue) => {
        if (err || !deletedIssue) {
          res.json({ error: "could not delete", _id: _id });
        } else {
          console.log("deleted issue: " + deletedIssue);
          res.json({ result: "successfully deleted", _id: _id });
        }
      });
    });
};
