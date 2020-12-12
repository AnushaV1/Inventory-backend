
require("dotenv").config();

const SECRET = process.env.SECRET_KEY || 'test';

const PORT = +process.env.PORT || 3001;

// database is:
//
// - on Heroku, get from env var DATABASE_URL
// - in testing, 'inventory-test'
// - else: 'inventory'

let DB_URI;

if (process.env.NODE_ENV === "test") {
  DB_URI = "inventory-test";
} else {
  DB_URI  = process.env.DATABASE_URL || 'inventory';
}

console.log("Using database", DB_URI);

module.exports = {
  SECRET,
  PORT,
  DB_URI,
};
