const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = "https://boilerplate-project-issuetracker.kaheng-lei.repl.co";

chai.use(chaiHttp);

let id1 = "";
suite("Functional Tests", function () {
  suite("POST /api/issues/{project} => object with issue data", function () {
    test("1. Every field filled in", function (done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "test-title",
          issue_text: "test-text",
          created_by: "Functional Test - Every field filled",
          assigned_to: "Chai and Mocha",
          status_text: "In QA",
          open: true,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "test-title");
          assert.equal(res.body.issue_text, "test-text");
          assert.equal(
            res.body.created_by,
            "Functional Test - Every field filled"
          );
          assert.equal(res.body.assigned_to, "Chai and Mocha");
          assert.equal(res.body.status_text, "In QA");
          assert.equal(res.body.project, "test");
          id1 = res.body._id;
          done();
        });
    });

    test("2. only required field filled in", function (done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "test-title",
          issue_text: "test-text",
          created_by: "Functional Test - Every field filled",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "test-title");
          assert.equal(res.body.issue_text, "test-text");
          assert.equal(
            res.body.created_by,
            "Functional Test - Every field filled"
          );
          assert.equal(res.body.assigned_to, "");
          assert.equal(res.body.status_text, "");
          assert.equal(res.body.project, "test");
          done();
        });
    });

    test("3. missing required fields", function (done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "test-title",
        })
        .end((err, res) => {
          assert.equal(res.body.error, "required field(s) missing");
          done();
        });
    });
  });

  suite("GET /api/issues/{project} => arry with all issue data", function () {
    test("4. No filter", function (done) {
      chai
        .request(server)
        .get("/api/issues/test")
        .query({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], "issue_title");
          assert.property(res.body[0], "issue_text");
          assert.property(res.body[0], "created_by");
          assert.property(res.body[0], "assigned_to");
          assert.property(res.body[0], "status_text");
          assert.property(res.body[0], "created_on");
          assert.property(res.body[0], "updated_on");
          assert.property(res.body[0], "open");
          assert.property(res.body[0], "project");
          done();
        });
    });

    test("5. One filter", function (done) {
      chai
        .request(server)
        .get("/api/issues/test")
        .query({ issue_text: "test-text" })
        .end((err, res) => {
          res.body.forEach((issueResult) => {
            assert.equal(issueResult.issue_text, "test-text");
          });
          done();
        });
    });

    test("6. Multiple filters", function (done) {
      chai
        .request(server)
        .get("/api/issues/test")
        .query({ issue_text: "test-text", issue_title: "test-title" })
        .end((err, res) => {
          res.body.forEach((issueResult) => {
            assert.equal(issueResult.issue_text, "test-text");
            assert.equal(issueResult.issue_title, "test-title");
          });
          done();
        });
    });
  });

  suite("PUT /api/issues/{project} => object with updated isse", function () {
    test("7. Update one field", function (done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: id1,
          issue_title: "update-title",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, `successfully updated`);
          done();
        });
    });

    test("8. Update multiple fields", function (done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: id1,
          issue_title: "update-title",
          created_by: "update-createor",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, `successfully updated`);
          done();
        });
    });

    test("9. missing _id", function (done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: "",
        })
        .end((err, res) => {
          assert.equal(res.body.error, "missing _id");
          done();
        });
    });

    test("10.No fields to update", function (done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: id1,
        })
        .end((err, res) => {
          assert.equal(res.body.error, "no update field(s) sent");
          done();
        });
    });

    test("11. With invalid id", function (done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: "abc",
          issue_title: "update-title",
        })
        .end((err, res) => {
          assert.equal(res.body.error, "could not update");
          done();
        });
    });
  });

  suite("DELETE /api/issues/{project} => delete an issue", function () {
    test("12. Delete an issue", function (done) {
      chai
        .request(server)
        .delete("/api/issues/test")
        .send({
          _id: id1,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully deleted");
          done();
        });
    });

    test("13. With an invalid ID", function (done) {
      chai
        .request(server)
        .delete("/api/issues/test")
        .send({
          _id: "abc",
        })
        .end((err, res) => {
          assert.equal(res.body.error, "could not delete");
          done();
        });
    });

    test("14. Missing _id", function (done) {
      chai
        .request(server)
        .delete("/api/issues/test")
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "missing _id");
          done();
        });
    });
  });
});
