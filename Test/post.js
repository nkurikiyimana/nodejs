let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");

//ASSERTION Style
chai.should();
chai.use(chaiHttp);

describe("Post API", () => {
  //Test the GET All Blog Post from route

  describe("GET /api/Posts", () => {
    it("it should GET all the Blogs", (done) => {
      chai
        .request(server)
        .get("/api/Posts")
        .end((err, response) => {
          response.should.have.status(200);
        });
      done();
    });
    it("it should NOT GET all the messages", (done) => {
      chai
        .request(server)
        .get("/api/post")
        .end((err, response) => {
          response.should.have.status(404);
        });

      done();
    });
  });
});
