import multer from "multer";

// for store the file 
const storage = multer.diskStorage({})

const upload = multer({storage})

export default upload
