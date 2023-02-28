let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");

//ASSERTION Style
chai.should();
chai.use(chaiHttp);

//test all Blog end Point

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

describe("GET /api/posts/:id", () => {
  it("it should GET a blog post by id", (done) => {
    chai
      .request(server)
      .get("/api/posts/63ee14531e3925704875265e")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("_id");
        res.body.should.have.property("title");
        res.body.should.have.property("content");
        res.body.should.have.property("image");
        res.body.should.have.property("likes");
        res.body.should.have.property("comments");
        res.body.should.have.property("_id").eql("63ee14531e3925704875265e");
        done();
      });
  });

  it("it should not GET a blog post by id", (done) => {
    chai
      .request(server)
      .get("/api/posts/hhhhhhhhhhhht888888")
      .end((err, res) => {
        res.should.have.status(404);
        /* const actualValue = res.body.message
          expect(actualValue).to.be.equal("There is no blog with such id" )*/
        done();
      });
  });
});

describe("POST /api/posts", () => {
  it("it should POST a blog", (done) => {
    const post = {
      title: "testing",
      content: "this is the testing mocha and chai",
      image: "fgh2345678dfghj",
    };

    chai
      .request(server)
      .post("/api/posts")
      //.set({ "Authorization": `Bearer ${token}`})
      .send(post)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("_id");
        res.body.should.have.property("title");
        res.body.should.have.property("content");
        res.body.should.have.property("image");
        res.body.should.have.property("likes");
        res.body.should.have.property("comments");
        done();
      });
  });
});

describe("PATCH /api/posts/:id", () => {
  it("it should PATCH a blog", (done) => {
    let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZTRjMGUwODgyYzU0MGU0NWQyMzVmZCIsImlhdCI6MTY3Njg5MjI5M30.mUrVu3UJvmcjukpVf8B2lLLiDqk_MObKzS2mF6eJPOsconst' 
    post = {
      title: "Development Agency33",
      content: "this is the testing mocha and chai",
      image: "fgh2345678dfghj3333333333333",
    };

    chai
      .request(server)
      .patch("/api/posts/63ee14531e3925704875265e")
      .set({ "Authorization": `Bearer ${token}`})
      .send(post)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("_id").eql("63ee14531e3925704875265e");
        res.body.should.have.property("title").eql("Development Agency33");
        res.body.should.have
          .property("content")
          .eql("this is the testing mocha and chai");
        res.body.should.have
          .property("image")
          .eql("fgh2345678dfghj3333333333333");
        done();
      });
  });
});

describe("DELETE /api/posts/:id", () => {
  it("it should DELETE a blog", (done) => {
    let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZTRjMGUwODgyYzU0MGU0NWQyMzVmZCIsImlhdCI6MTY3Njg5MjI5M30.mUrVu3UJvmcjukpVf8B2lLLiDqk_MObKzS2mF6eJPOsconst' 
       chai
      .request(server)
      .delete("/api/posts/63e94e5e3f1b2c2f2649c9ae")
      .set({ "Authorization": `Bearer ${token}`})
      .end((err, res) => {
        res.should.have.status(204);
        res.body.should.be.a("object");
        /* const actualValue = res.body.message
         expect(actualValue).to.be.equal("blog deleted successfully" )*/
        done();
      });
  });
});

//test all Content end Point

describe("Post API", () => {
  //Test the GET All Blog Post from route

  describe("GET /api/Contact", () => {
    it("it should GET all the contact querries", (done) => {
      chai
        .request(server)
        .get("/api/Contact")
        .end((err, response) => {
          response.should.have.status(200);
        });
      done();
    });
    it("it should NOT GET all the messages", (done) => {
      chai
        .request(server)
        .get("/api/contact")
        .end((err, response) => {
          response.should.have.status(404);
        });

      done();
    });
  });
});
describe("GET /api/Contact/:id", () => {
  it("it should GET a blog post by id", (done) => {
    chai
      .request(server)
      .get("/api/Contact/63e4edf85064a32224fc5019")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("_id");
        res.body.should.have.property("name");
        res.body.should.have.property("email");
        res.body.should.have.property("message");
        res.body.should.have.property("_id").eql("63e4edf85064a32224fc5019");
        done();
      });
  });

  it("it should not GET a blog post by id", (done) => {
    chai
      .request(server)
      .get("/api/Contact/hhhhhhhhhhhht888888")
      .end((err, res) => {
        res.should.have.status(404);
        /* const actualValue = res.body.message
          expect(actualValue).to.be.equal("There is no blog with such id" )*/
        done();
      });
  });
});

describe("POST /api/Contact", () => {
  it("it should POST a contact Querrie message", (done) => {
    let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZTRjMGUwODgyYzU0MGU0NWQyMzVmZCIsImlhdCI6MTY3Njg5MjI5M30.mUrVu3UJvmcjukpVf8B2lLLiDqk_MObKzS2mF6eJPOsconst' 
   
    const contact = {
      name: "Faustin",
      email: "nkuru@gmail.com",
      message: "Hello mocha and chai",
    };

    chai
      .request(server)
      .post("/api/Contact")
      .set({ "Authorization": `Bearer ${token}`})
      .send(contact)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a("object");
        res.body.should.have.property("_id");
        res.body.should.have.property("name").eql("testing");
        res.body.should.have.property("email") .eql("this is the testing mocha and chai");
        res.body.should.have.property("message").eql("fHello User!");
        done();
      });
  });
});
describe("PATCH /api/Contact/:id", () => {
  it("it should PATCH a Querry message", (done) => {
    let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZTRjMGUwODgyYzU0MGU0NWQyMzVmZCIsImlhdCI6MTY3Njg5MjI5M30.mUrVu3UJvmcjukpVf8B2lLLiDqk_MObKzS2mF6eJPOsconst' 
    const contact = {
      name: "Rwanda visit",
      email: "mocha@chai.com",
      message: "Hello",
    };

    chai
      .request(server)
      .patch("/api/Contact/63e4edf85064a32224fc5019")
      .set({ "Authorization": `Bearer ${token}`})
      .send(contact)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("_id").eql("63e4edf85064a32224fc5019");
        res.body.should.have.property("name").eql("Rwanda visit");
        res.body.should.have .property("email").eql("mocha@chai.com");
        done();
      });
  });
});

describe("DELETE /api/Contact/:id", () => {
  it("it should DELETE a Querry message", (done) => {
    let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZTRjMGUwODgyYzU0MGU0NWQyMzVmZCIsImlhdCI6MTY3Njg5MjI5M30.mUrVu3UJvmcjukpVf8B2lLLiDqk_MObKzS2mF6eJPOsconst' 
    chai
      .request(server)
      .delete("/api/Contact/63f28c4ab7b23d648f4fa847")
      .set({ "Authorization": `Bearer ${token}`})
      .end((err, res) => {
        res.should.have.status(204);
        res.body.should.be.a("object");
        /* const actualValue = res.body.message
         expect(actualValue).to.be.equal("blog deleted successfully" )*/
        done();
      });
  });
});

// like

describe('POST /api/Like/:id', () => {
  it('it should POST like to the specified blog',(done) => {
    let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZTRjMGUwODgyYzU0MGU0NWQyMzVmZCIsImlhdCI6MTY3Njg5MjI5M30.mUrVu3UJvmcjukpVf8B2lLLiDqk_MObKzS2mF6eJPOsconst' 
     chai.request(server)
     .post('/api/Like/63f28c4ab7b23d648f4fa847')
     .set({ "Authorization": `Bearer ${token}`})
     .end((err,res) => {
         res.should.have.status(200);
         res.body.should.be.a('object');
        /* const actualValue = res.body.message
         expect(actualValue).to.be.equal("Blog has been liked!" )*/
         done();
     });

     
     });

    })


// Comments

describe('POST /api/comments/:id', () => {
  it('it should POST a comment in mongoDB to a specified Blog',(done) => {
    let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZTRjMGUwODgyYzU0MGU0NWQyMzVmZCIsImlhdCI6MTY3Njg5MjI5M30.mUrVu3UJvmcjukpVf8B2lLLiDqk_MObKzS2mF6eJPOsconst' 
     const comment = {
         commentValue:"Test comment on Rwanda Visit ",
      }
     chai.request(server)
     .post('/api/comments/63e9389b2636aabe666eabeb')
     .set({ "Authorization": `Bearer ${token}`})
     .send(comment)
     .end((err,res) => {
         res.should.have.status(200);
         res.body.should.be.a('object');
         done();
     });

     
     });

    })
