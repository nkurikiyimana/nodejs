let chai = require('chai');
let chaiHttp = require("chai-http");
let server = require("../index");

//ASSERTION Style
chai.should();
chai.use(chaiHttp);

describe('a suite of 7 seconds', function () {
  this.timeout(1500);
  it('should take less than 40s', function (done) {
    setTimeout(done, 1000);
  });

  it('should take less than 12s as well', function (done) {
    setTimeout(done, 500);
  });


describe('post/api', () => {
  // Test get Routes
  it('it should GET all the posts', (done) => {
    chai.request(server)
      .get('/api/posts')
      .end((err, res) => {
        res.should.have.status(204);
        res.body.should.be.a('array');
        done();
      });
  });

  // Test get by Id Routes
  describe('/GET/api/:id post', () => {
    it('it should GET a post by the given id', (done) => {
      const postId = 'some-post-id';
      chai.request(server)
        .get("/api/posts/63e417f2f7123e13db09272f")
        .end((err, res) => {
          res.should.have.status(204);
          done();
        });
    });
  });

  // Test post Routes
  describe('/POST/posts', () => {
    it('it should POST a new post', (done) => {
      const post = {
        title: 'Test Post',
        image: 'test-image.jpg',
        content: 'This is a test post',
      };
      chai.request(server)
        .post('/api/posts')
        .send(post)
        .end((err, res) => {
          res.should.have.status(204);
          res.body.should.be.a('object');
          res.body.should.have.property('title').eql(post.title);
          done();
        });
    });
  });

  // Test patch Routes
  describe('/PATCH/:id/posts', () => {
    it('it should UPDATE a post given the id', (done) => {
      const postId = 'some-post-id';
      const updatedPost = {
        title: 'Updated Test Post',
        image: 'updated-test-image.jpg',
        content: 'This is an updated test post',
      };
      chai.request(server)
        .patch(`/api/posts/${postId}`)
        .send(updatedPost)
        .end((err, res) => {
          res.should.have.status(204);
          res.body.should.be.a('object');
          res.body.should.have.property('title').eql(updatedPost.title);
          done();
        });
    });
  });

  // Test delete Routes
  describe('/DELETE/:id post', () => {
    it('it should DELETE a post given the id', (done) => {
      const postId = 'some-post-id';
      chai.request(server)
        .delete(`/api/posts/${postId}`)
        .end((err, res) => {
          res.should.have.status(204);
          done();
        });
    });
  });
});


});
const request = require('request');

const url = 'https://jsonplaceholder.typicode.com/posts';

request(url, function(error, response, body) {
  if (error) {
    console.error('Error:', error);
  } else if (response.statusCode !== 200) {
    console.error('Invalid status code:', response.statusCode);
  } else {
    const posts = JSON.parse(body);
    for (let i = 0; i < posts.length; i++) {
      console.log(`Post ${i}: ${posts[i].title}`);
    }
  }
});