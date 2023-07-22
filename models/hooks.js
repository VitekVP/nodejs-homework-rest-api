export const handleSaveErrorMongoose = (error, data, next) => {
	error.status = 400;
	next();
};

export const handleUpdateValidateMongoose = function (next) {
	this.options.runValidators = true;
	next();
};
