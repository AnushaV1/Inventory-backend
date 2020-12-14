process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require('../../app');
const db = require("../../db");
const User = require("../../models/user")
const upcDetails = require("../../models/upcDetails")
const createToken = require("../../helpers/createToken");

let testUser;
let token;
let testUpc;
let newTestUser;
let addUPC;

beforeEach(async () => {
	testUser = {
        username: "testuser10",
        firstname: "fname3",
        lastname: "lname3",
        password: "testuser3",
        email: "test3@user.com",
        address: "127 Test address",
        state: "sample state11",
        city:"sample city11",
        zipcode: 22222,
        country: "USA"
        };

        testUpc = {
            upc: 885909950805,
            title: 'Apple iPhone 6',
            brand: 'Apple',
            model: 'MG5A2LL/A',
            category: 'Electronics->Computer',
            image_link: 'https://image.com',
            description: 'Test description'
        };
    
    newTestUser = await User.register(testUser);
    token = createToken(newTestUser);

	addUPC = await upcDetails.addUpcProduct(testUpc.upc,testUpc.title,testUpc.brand,testUpc.model,testUpc.category,testUpc.image_link, testUpc.description)
    
    });

afterEach(async () => {
    await db.query('DELETE FROM users');
	await db.query('DELETE FROM upc');
});

afterAll(async () => {
	await db.end();
});

describe("GET /all UPC", function () {
    test("Fetch all UPC", async function () {
    const result = await request(app).get(`/api/upc`).send({ _token: token });
    expect(result.statusCode).toEqual(200);
    })

    test("No token authentication error testing GET ALL upc", async function () {
        const result = await request(app).get(`/api/upc`)
        expect(result.body.message). toEqual('You must authenticate first.')
        expect(result.body.error.status).toEqual(401);
        })
})


describe("GET /upcCode", function () {
    test("Fetch upc with code", async function () {
const res = await request(app).get(`/api/upc/${testUpc.upc}`).send({ _token: token });
expect(res.body).toHaveProperty("result");
expect(res.statusCode).toEqual(200);
})

test("Failed test for fetch upc with code with no token", async function () {
    const res = await request(app).get(`/api/upc/${testUpc.upc}`).send({});
    expect(res.body.message).toEqual('You must authenticate first.')
    expect(res.body.error.status).toEqual(401);
    })

})