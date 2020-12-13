const request = require("supertest");
process.env.NODE_ENV = "test";
const app = require('../../app');
const db = require("../../db");
const User = require("../../models/user")
const createToken = require("../../helpers/createToken");

let testUser;
let token;
beforeEach(async () => {
	testUser = {
    username: "testuser1",
    firstname: "fname1",
    lastname: "lname1",
    password: "testuser1",
    email: "test1@user.com",
    address: "12 Test address",
    state: "sample state1",
    city:"sample city1",
    zipcode: 11111,
    country: "USA"
	};

  const newTestUser = await User.register(testUser);
  token = createToken(newTestUser);
});

afterEach(async () => {
	await db.query('DELETE FROM users');
});

afterAll(async () => {
	await db.end();
});

describe("POST /users", function () {
  test("Creates a new user", async function () {
    let dataObj = {
      username: "testuser2",
      firstname: "fname2",
      lastname: "lname2",
      password: "testuser2",
      email: "test2@user.com",
      address: "38 Test address",
      state: "sample state",
      city:"sample city",
      zipcode: 11111,
      country: "USA"
    }

    const response = await request(app).post("/users/").send(dataObj);
    expect(response.statusCode).toEqual(201);
    expect(response.body).toHaveProperty("token");
  });
});

describe("POST /users", function () {
  test("Test error with same username", async function () {
    testUserNew = {
      username: "testuser1",
      firstname: "fname1",
      lastname: "lname1",
      password: "testuser1",
      email: "test1@user.com",
      address: "12 Test address",
      state: "sample state1",
      city:"sample city1",
      zipcode: 11111,
      country: "USA"
    };
  
    const response = await request(app).post("/users/").send(testUserNew);
    expect(response.statusCode).toEqual(409);

  });
})

describe("GET /users", function () {
  test("Fetch user with username", async function () {

const newResponse = await request(app).get(`/users/testuser1`).send({ _token: token });
expect(newResponse.statusCode).toEqual(200);
  })

  test('get user, unauthorized', async () => {
      let result = await request(app).get(`/users/testuser1`).send({});
		expect(result.statusCode).toEqual(401);
		expect(result.body).toHaveProperty('error', {
			message: 'You must authenticate first.',
			status: 401
		});
	});
})

describe('/POST login', () => {
	test('User Login success', async () => {
		let result = await request(app).post('/login').send({
			username: testUser.username,
			password: testUser.password
		});
		expect(result.statusCode).toEqual(200);
		expect(result.body).toHaveProperty("token");
	});


})

describe('/POST login failure', () => {
test('Test for user not authenticated ', async () => {
  let result = await request(app).post('/login').send({
    username: testUser.username,
    password: " "
  });
	expect(result.statusCode).toEqual(401);
})

});

describe('PATCH/users/:username', () => {
	test("Successful patch route", async () => {

		let result = await request(app).patch(`/users/testuser1`).send({
			firstname: 'changedFirstName',
			password: testUser.password,
			_token: token
		});

		expect(result.statusCode).toEqual(200);
		expect(result.body.user.firstname).toEqual('changedFirstName');
	});

	test("edit a user's , schema fail", async () => {
		let result = await request(app).patch(`/users/testuser1`).send({
			firstname: 'fakeFirstname',
			_token: token,
			password: 'wrong_password'
		});
		expect(result.statusCode).toEqual(401);
	});
});


describe("DELETE /users/:username", () => {
  test("Delete user if logged in and correct user", async () => {
      const response = await request(app).delete(`/users/testuser1?_token=${token}`);
      expect(response.body.message).toBe("User deleted");
  });

  test("Respond with 401 unauthorized user", async () => {
    const fakeToken = "123TYU"
      const response = await request(app).delete(`/users/testuser2?_token=${fakeToken}`);
      expect(JSON.parse(response.text).message).toBe("Unauthorized, invalid token!")

  });

  test("Responds with 401 error id not found", async () => {
      const response = await request(app).delete(`/users/notauser?_token=${token}`);
      expect(response.statusCode).toEqual(401);
  });
});


