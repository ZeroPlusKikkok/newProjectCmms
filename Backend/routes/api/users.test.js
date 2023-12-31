// Access supertest module functionality under the varible name "request"
const request = require('supertest');

// Top level of this test suite: the entire user API
describe('The User API', () => {
  // Specific test
  it('Return a list of all users', async () => {
    // Connect to the server and get a response
    // expect that response to be a 200 and serve JSON
    const res = await request('http://localhost:3000')
      .get('/api/users/list')
      .expect(200)
      .expect('Content-Type', /json/);
    // Thess expects are jest, not supertest
    // First, expect to get a result that is an array
    expect(Array.isArray(res.body)).toBe(true);
    // Second, expect the array to have something in it
    expect(res.body.length).toBeGreaterThan(0);
    // Third, expect the username of the first returned user to be username
    expect(res.body[0].username).toBe('santi');
  });
});