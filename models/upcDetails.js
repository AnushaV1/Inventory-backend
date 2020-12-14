const db = require("../db");
const ExpressError = require("../helpers/expressError");

class upcDetails {

    constructor({upc,title,brand,model,category,image_link, description}) {
        this.upc = upc;
        this.title = title;
        this.brand = brand;
        this.model = model;
        this.category = category;
        this.image_link = image_link;
        this.description = description;
    }
    get upc() {
        return this._upc;
    }
    
    set upc(val){
        if(!val) throw new ExpressError("Cannot be null");
        this._upc = val;
    }
    
    
    static async get(upc){
        const result = await db.query(`SELECT upc_code,title,brand,model,category,image_link.description FROM upc WHERE upc_code=$1`, [upc])
        let product = result.rows[0];
        if(product === undefined){
            throw new ExpressError("Empty result");
        }
        return result.rows[0];
    }

    static async search(upc){

        const result = await db.query(`SELECT upc_code,title,brand,model,category, image_link,description FROM upc WHERE upc_code=$1`, [upc])

            return result.rows[0];
    }
    

    static async addUpcProduct(upc,title,brand,model,category,image_link, description) {
        const checkDuplicateUPC = await db.query(
            `SELECT upc_code 
            FROM upc 
            WHERE upc_code = $1`,
        [upc]
        );

        if (!checkDuplicateUPC.rows[0]) {


        const result = await db.query(
            `INSERT INTO upc (
                upc_code,
                title,
                brand,
                model,
                category,
                image_link,
                description
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING upc_code,title,brand,model,category,image_link,description`,
                [upc,
                title,
                brand,
                model,
                category,
                image_link,
                description
                ]);
        
        return result.rows[0];
            }
    }

    static async getAllUPC() {
            const results = await db.query(`SELECT upc_code,title,brand,model,category,image_link, description FROM upc`);
            return results.rows;
    }

}

module.exports = upcDetails;