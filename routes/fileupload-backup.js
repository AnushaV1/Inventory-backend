const multer = require("multer");
const helpers = require("../helpers/helpers")



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public")
    },
    filename: function (req, file, cb) {
        const parts = file.mimetype.split("/");
        cb(null, `${file.fieldname}-${Date.now()}.${parts[1]}`)
    }
  })
  
  
  router.post("/upload", (req, res, next) => {
  
  let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).fields([{name:'receipt_image', maxCount:1}, {name:'product_image', maxCount:1}]);
  upload(req, res, function(err) {
    console.log("Requested body", req.body)
    if (req.fileValidationError) {
        return res.send(req.fileValidationError);
    }
            else if (!req.file) {
              return res.send('Please select an image to upload');
          }
          else if (err instanceof multer.MulterError) {
              return res.send(err);
          }
          else if (err) {
              return res.send(err);
          }
  
    let result = "You have uploaded these images: <hr />";
    const files = req.files;
    let index, len;
  
  
    // Loop through all the uploaded images and display them on frontend
    for (index = 0, len = files.length; index < len; ++index) {
        result += `<img src="${files[index].path}" width="300" style="margin-right: 20px;">`;
    }
    //result += '<hr/><a href="./">Upload more images</a>';
    res.send(result);
  });
   // res.sendFile(`${filePath}/public/${req.file.filename}`);
    //console.log(req.files)
    //return res.status(201).json({ message:"Files uploaded" });
  })