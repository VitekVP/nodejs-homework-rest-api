import multer from "multer";
import path from "path";

const destination = path.resolve("tmp");

const storage = multer.diskStorage({
	destination,
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});

const limits = {
	fileSize: 1024 * 1024 * 5,
};

const uploadFile = multer({
	storage,
	limits,
});

export default uploadFile;
