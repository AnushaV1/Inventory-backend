const db = require("../db");
const ExpressError = require("../helpers/expressError");
const addToUpc = require("../helpers/addToUpcDB")
const partialUpdate = require("../helpers/partialUpdate");

class ProductDetail {

    constructor({upc,product_name,purchased_at,product_price,purchase_date,return_policy,serial_number,warranty_period, manual_link,receipt_image,user_product_image}) {
        this.upc = upc;
        this.product_name = product_name;
        this.purchased_at = purchased_at;
        this.product_price = product_price;
        this.return_policy = return_policy;
        this.purchase_date = purchase_date;
        this.serial_number = serial_number;
        this.warranty_period = warranty_period;
        this.manual_link = manual_link;
        this.receipt_image = receipt_image || null;
        this.user_product_image = user_product_image || null;
        
    }
    get upc() {
        return this._upc;
    }
    
    set upc(val){
        if(!val) throw new ExpressError("Cannot be null");
        this._upc = val;
    }

    
    static async getAll(qryData) {
    
        const results = await db.query(query);
        if (results.rows.length === 0) {
            throw new ExpressError('No such Inventory', 404)
        }
        return results.rows.map(c => new ProductDetail(c));
    }
    
    static async get(upc){
        const result = await db.query(`SELECT id,upc,product_name,product_price,warranty_period,return_policy,serial_number,manual_link,product_image FROM upc WHERE upc_code=$1`, [upc])
        let product = result.rows[0];
        if(product === undefined){
            throw new ExpressError("No such upc code");
        }
        return new ProductDetail(product);
    }
    

    static async getAllProducts(userid){
        if (!userid) throw new ExpressError('User not found', 400);
        
        const results = await db.query(`SELECT id,upc,product_name,product_price,purchased_at,purchase_date,warranty_period, return_policy,serial_number,manual_link,receipt_image,user_product_image FROM user_product WHERE userid=$1`, [userid])
        if (!results) throw new ExpressError('No products added', 400);
            return results.rows;
    }

    static async addProduct(product_name,product_price,purchased_at,purchase_date,
        warranty_period,return_policy,manual_link,serial_number, receipt_image,
        user_product_image,upc,userid) {
            
            if(upc) {
                const addToUpcTable = addToUpc(upc)
            }
            const result = await db.query(
            `INSERT INTO user_product (
                product_name,
                product_price,
                purchased_at,
                purchase_date,
                warranty_period,
                return_policy,
                manual_link,
                serial_number,
                receipt_image,
                user_product_image, 
                upc,
                userid)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                RETURNING id,upc,product_name, product_price,purchased_at,purchase_date,warranty_period,return_policy,serial_number,manual_link,receipt_image,user_product_image`,
            [product_name,
                product_price,
                purchased_at,
                purchase_date,
                warranty_period,
                return_policy,
                manual_link,
                serial_number,
                receipt_image,
                user_product_image, 
                upc,
                userid]);
                

                return result.rows[0];
    }

    static async updateProduct(id, data) {
        const { query, values } = partialUpdate("user_product",data,"id", id);
        const result = await db.query(query, values);
    
        if (result.rows.length === 0) {
            throw new ExpressError(`No such product id ${id}`, 404)
        }
    
        return result.rows[0];
    }

    static async deleteSingleProduct(userId,productId) {
        const result = await db.query(
            `DELETE FROM user_product 
            WHERE userid = $1 AND id = $2
            RETURNING id`,
            [userId, productId]);
    
            if (result.rows.length === 0) {
                throw new ExpressError('No such user or products', 404)
            }
        
    }
}

module.exports = ProductDetail;