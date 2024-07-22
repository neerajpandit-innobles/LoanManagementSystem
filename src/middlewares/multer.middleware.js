// import multer from "multer";

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './public/temp')
//     },
//     filename: function (req, file, cb) {
//        cb(null, file.originalname)
//     }
//   })
//   // console.log(upload)
// export const upload = multer({
//     storage,
// })

import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp'); // Specify the destination directory
  },
  filename: function (req, file, cb) {
    const username = req.body.username || 'unknown_user'; // Ensure username is available in the request body
    const timestamp = Date.now();
    const originalname = file.originalname;
    cb(null, `${username}_${timestamp}_${originalname}`); // Customize the filename
  }
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|pdf/; // Allowed file types
  const extname = fileTypes.test(file.originalname.toLowerCase()); // Check the file extension
  const mimetype = fileTypes.test(file.mimetype); // Check the mime type

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (jpeg, jpg, png) and PDFs are allowed!'));
  }
};

const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB
  files: 10 // Maximum number of files
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits
});

