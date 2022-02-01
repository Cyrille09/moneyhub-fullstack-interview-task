const request = require('supertest');
const express = require('express');

const app = express();

describe('GET /users csv', function () {
  test('responds with users cvs', (done) => {
    const filename = `users.csv`;
    request(app)
      .get('/investments/export')
      .set('Content-disposition', `attachment; filename=${filename}`)
      .set('Content-type', 'text/csv')
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        done();
      });
  });
});
