import multer from "multer";

const excelUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: async (req, file, cb) => {
    try {
      const allowedMimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      if (file.mimetype !== allowedMimeType) {
        return cb(new Error("Error: Only XLSX files are allowed!"), false);
      }
      cb(null, true);
    } catch (error) {
      console.error(error);
      return cb(error, false); 
    }
  },
});

export default excelUpload;
