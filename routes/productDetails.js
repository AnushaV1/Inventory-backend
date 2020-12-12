const express = require("express");
const router = new express.Router();
const ProductDetail = require("../models/ProductDetail");
const {authRequired} = require("../middleware/auth");
const multer = require("multer");
const helpers = require("../helpers/helpers")

router.get("/:userid", authRequired, async function(req, res, next) {
    try {
        const result = await ProductDetail.getAllProducts(req.params.userid);
        return res.json(result);
    } catch (err) {
        return next(err);
    }
    });


    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "public")
        },
        filename: function (req, file, cb) {
            const parts = file.mimetype.split("/");
            cb(null, `${file.fieldname}-${Date.now()}.${parts[1]}`)
        }
    })

    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter });


    router.post("/addProduct", authRequired, upload.fields([{name:'receiptImg', maxCount:1}, {name:'productImg', maxCount:1}]), async (req, res, next) => {
        let receipt_image =" ";
        let  user_product_image = " " ;

        if (req.files) {
        if (req.files.receiptImg !== undefined) {
            receipt_image = req.files.receiptImg[0].filename
        }
        if(req.files.productImg !== undefined) {
            user_product_image =  req.files.productImg[0].filename
        }
    }

        try {
            let productAdded =  await ProductDetail.addProduct(req.body.product_name,
                req.body.product_price,
                req.body.purchased_at,
                req.body.purchase_date,
                req.body.warranty_period,
                req.body.return_policy,
                req.body.manual_link,
                req.body.serial_number,
                receipt_image,
                user_product_image, 
                req.body.upc,
                req.userid);
                
                return res.json(productAdded);
            } catch (err) {
                return next(err);
            }
    
    })

    router.put("/updateProduct", authRequired, async function(req, res, next) {
        try {

            if (req.files) {
                const image = req.file.filename;
                updates.image = image;
            }
        
            const product = await ProductDetail.updateProduct(req.query.productId,req.body);
            return res.json({ product });
        } catch (err) {
            return next(err);
        }
        });



router.patch("/:productId", authRequired, async function(req, res, next) {
    try {
    const product = await ProductDetail.updateProduct(req.params.productId,req.body);
    return res.json({ product });
    } catch (err) {
        return next(err);
    }
});

router.delete("/:userId/:productId",  async function(req, res, next) {
    try {    
        await ProductDetail.deleteSingleProduct(req.params.userId, req.params.productId);
        return res.json({message: "Product deleted"});
    } catch (err) {
        return next(err);
    }
    });



module.exports = router;
