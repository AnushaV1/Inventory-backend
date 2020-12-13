const db = require("../db");
const bcrypt = require("bcrypt");
const partialUpdate = require("../helpers/partialUpdate");
const ExpressError = require("../helpers/expressError");

const BCRYPT_WORK_FACTOR = 10;

class User {

  static async authenticate(data) {
      const result = await db.query(
        `SELECT id, 
                username, 
                password, 
                email, 
                address,
                city,
                state,
                country,
                zipcode 
                FROM users 
          WHERE username = $1`,
        [data.username]
    );

    const user = result.rows[0];

    if (user) {

      const isValid = await bcrypt.compare(data.password, user.password);
      if (isValid) {
        return user;
      }
    }
    const invalidCredentials = new ExpressError('Invalid Credentials');
		invalidCredentials.status = 401;
		throw invalidCredentials;
  }

  static async register(data) {
    const duplicateCheck = await db.query(
        `SELECT id, username, email 
            FROM users 
            WHERE username = $1 OR email = $2`,
        [data.username, data.email]
    );

    if (duplicateCheck.rows[0]) {
      throw new ExpressError(`Username ${data.username}  or ${data.email} already exists!`, 409)
    }


    const hashedPassword = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users 
          (username, password, firstname, lastname, address, city, state, country, zipcode, email) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
        RETURNING id, username, password, firstname, lastname, address, city, state, country, zipcode, email`,
      [
        data.username,
        hashedPassword,
        data.firstname,
        data.lastname,
        data.address,
        data.city,
        data.state,
        data.country,
        data.zipcode,
        data.email
      ]);
    return result.rows[0];
  }

  static async findOne(username) {
    const userRes = await db.query(
        `SELECT username, password, firstname, lastname, address, city, state, country, zipcode, email
            FROM users 
            WHERE username = $1`,
        [username]);

    const user = userRes.rows[0];

    if (!user) {
      const err = new ExpressError(`No such user: ${username}`);
      err.status = 404;
      throw err;
    }
    return user;
  }


  static async update(username, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    let {query, values} = partialUpdate(
        "users",
        data,
        "username",
        username
    );

    const result = await db.query(query, values);
    const user = result.rows[0];

    if (!user) {
      throw new ExpressError(`No such user with username '${username}`, 404)
    }

    delete user.password;
    delete user.is_admin;

    return result.rows[0];
  }


  static async remove(username) {
      let result = await db.query(
              `DELETE FROM users 
                WHERE username = $1
                RETURNING username`,
              [username]);

    if (result.rows.length === 0) {
      throw new ExpressError(`No such user with username '${username}`, 404)
    }
  }
}


module.exports = User;
