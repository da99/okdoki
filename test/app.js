var request = require('supertest')
  , server = require('okdoki/lib/app').server;

describe('GET /', function(){
  it('respond with json', function(done){
    request(server)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200)
      .end(done);
  })
})
