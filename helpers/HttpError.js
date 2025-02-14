const messages = {
	400: "Bad Request",
	401: "Unauthorized",
	403: "Forbidden",
	404: "Not Found",
	405: "Method Not Allowed",
	409: "Conflikt",
};

const HttpError = (status, message = messages[status]) => {
	const error = new Error(message);
	error.status = status;
	return error;
};

export default HttpError;
