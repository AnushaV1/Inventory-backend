const upcDetails = require("../models/upcDetails");
const getProductFromAPI = require("../helpers/getProductFromAPI");
const ExpressError = require("../helpers/expressError");


        async function addToUpc(upcCode) {            
            const result = await upcDetails.search(upcCode)
        
            if (result === undefined) {
                const response =  await getProductFromAPI.getProduct(upcCode);
                if(response !== undefined) {
                    const {upc,brand,model,title,category,images, description } = response
                    const image_link = images[0]
                    const addUPC = await upcDetails.addUpcProduct(upc,title,brand,model,category,image_link, description)
                    return upc;
                }
                else {
                    return {message: "No such UPC Code"}
                }
            }
            return upcCode;
        } 

        module.exports = addToUpc


