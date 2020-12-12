const express = require("express");
const router = new express.Router();
const getProductFromAPI = require("../helpers/getProductFromAPI");
const upcDetails = require("../models/upcDetails");
const {authRequired} = require("../middleware/auth");

    router.get("/:upcCode", authRequired,  async function(req, res, next) {
        try {
            const response = await getProductFromAPI.getProduct(req.params.upcCode);
            if(response !== undefined) {
                const {upc,brand,model,title,category,images, description } = response
                const image_link = images[0]
                const addUPC = await upcDetails.addUpcProduct(upc,title,brand,model,category,image_link, description)
                return res.json({response});
            }
            else {
                return res.status(400).json({message: "No such UPC Code"})
            }
            
            }
            catch (err) {
            return next(err);
        }
        });

        router.get("/", authRequired,  async function(req, res, next) {
            try {
                const result = await upcDetails.getAllUPC();
                return res.json(result);
                }     catch (err) {
                    return next(err);
                }   

            });
module.exports = router;