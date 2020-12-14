const request = require("supertest");
process.env.NODE_ENV = "test";
const app = require('../../app');
const db = require("../../db");
const User = require("../../models/user")
const Product = require("../../models/ProductDetail")
const createToken = require("../../helpers/createToken");

let testUser;
let token;
let userid;
let productid;

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
    userid = newTestUser.id
    token = createToken(newTestUser);

testProduct = {
    product_name: 'TCL TV',
    product_price: 490,
    purchased_at: 'Best Buy',
    purchase_date: '2020-10-10',
    warranty_period: '1 year',
    return_policy: '6 months',
    manual_link: 'http://manual.com',
    serial_number: '156ESwQ',
    receipt_image: '',
    user_product_image: '', 
    upc: 846042006668,
    userid: `${userid}`
}
const addProduct = await Product.addProduct(
    testProduct.product_name,
    testProduct.product_price,
    testProduct.purchased_at,
    testProduct.purchase_date,
    testProduct.warranty_period,
    testProduct.return_policy,
    testProduct.manual_link,
    testProduct.serial_number,
    testProduct.receipt_image,
    testProduct.user_product_image,
    testProduct.upc,
    testProduct.userid)
productid = addProduct.id

});

afterEach(async () => {
 await db.query('DELETE FROM users');
 await db.query('DELETE FROM user_product')
});

afterAll(async () => {
	await db.end();
});

describe("POST /products", function () {
    test("Add new product to table", async function () {
    testProduct1 = {
    product_name: 'Iphone',
    product_price: 690,
    purchased_at: 'Store1',
    purchase_date: '2020-11-10',
    warranty_period: '1 year',
    return_policy: '6 months',
    manual_link: 'http://manuallink.com',
    serial_number: '236ESwQ',
    receipt_image: '',
    user_product_image: '', 
    upc: 885909950805,
    userid: `${userid}`
    }
        const response = await request(app).post(`/product/addProduct?_token=${token}`).send(testProduct1);
        expect(response.statusCode).toEqual(200);
    });
});

describe("POST /product", function () {
  test("Test error with same serial number", async function () {
  testProduct3= {
    product_name: 'Iphone',
    product_price: 690,
    purchased_at: 'Store1',
    purchase_date: '2020-11-10',
    warranty_period: '1 year',
    return_policy: '6 months',
    manual_link: 'http://manuallink.com',
    serial_number: '156ESwQ',
    receipt_image: '',
    user_product_image: '', 
    upc: 885909950805,
    userid: `${userid}`
    }
    const response = await request(app).post(`/product/addProduct?_token=${token}`).send(testProduct3);
    expect(response.body).toHaveProperty('error', {
    message: 'Serial number already exists',
    status: 400
});
});
})

describe("GET /product /:userid", function () {
    test("Get all products for users", async function () {
    const newResponse = await request(app).get(`/product/${userid}`).send({ _token: token });
    expect(newResponse.statusCode).toEqual(200);
})

    test('get product, unauthorized user', async () => {
        let result = await request(app).get(`/product/${userid}`).send({});
        expect(result.statusCode).toEqual(401);
		expect(result.body).toHaveProperty('error', {
			message: 'You must authenticate first.',
			status: 401
        });
    
    });
    test('get product, with no userid', async () => {
        let result = await request(app).get(`/product/`).send({_token: token});
            expect(JSON.parse(result.text).message).toBe('Not Found');
    });
})



describe('PATCH/product/:productId', () => {
	test("Successful patch route", async () => {

		let result = await request(app).patch(`/product/${productid}`).send({
			product_name: 'newProduct',
			_token: token
		});

		expect(result.statusCode).toEqual(200);
		expect(result.body.product.product_name).toEqual('newProduct');
    });
    test("patch route with no token", async () => {

		let result = await request(app).patch(`/product/${productid}`).send({
			product_name: 'newProduct'
        });

        expect(result.statusCode).toEqual(401);
		expect(result.body).toHaveProperty('error', {
			message: 'You must authenticate first.',
			status: 401
        });
	});

    test("patch route with wrong or missing id", async () => {
        const invalidId = 9999999
		let result = await request(app).patch(`/product/${invalidId}`).send({
            product_name: 'newProduct',
            _token: token
        });
        console.log(result.body)
        expect(result.body.message).toEqual(`No such product id ${invalidId}`);
		});
});


describe("DELETE /product/:userId/:productId", () => {
    test("Delete product if logged in", async () => {
        const response = await request(app).delete(`/product/${userid}/${productid}?_token=${token}`);
        expect(response.body.message).toBe("Product deleted");
    });

    test("Respond with 401 unauthorized user", async () => {
        const fakeToken = "123TYU"
        const response = await request(app).delete(`/product/${userid}/${productid}?_token=${fakeToken}`);
        expect(response.body.message).toEqual('You must authenticate first.')
        expect(response.body.error.status).toEqual(401);

    });

    test("Responds with 404 error userid/productid not found", async () => {
        const response = await request(app).delete(`/product/99999999/${productid}?_token=${token}`);
        expect(response.body.message).toEqual('No such user or products');
        expect(response.statusCode).toEqual(404);
    });
});


