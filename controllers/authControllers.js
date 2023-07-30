import bcrypt from "bcrypt";
import "dotenv/config";
import jwt from "jsonwebtoken";

import User from "../models/user.js";
import { HttpError } from "../helpers/index.js";
import { controllerWrapper } from "../decorators/index.js";
import { token } from "morgan";

const { JWT_KEY } = process.env;

const signup = async (req, res) => {
	const { password, email } = req.body;

	const user = await User.findOne({ email });
	if (user) {
		throw HttpError(409, "Email in use");
	}

	const hashPassword = await bcrypt.hash(password, 10);

	const newUser = await User.create({ ...req.body, password: hashPassword });
	res.status(201).json({
		user: {
			email: newUser.email,
			subscription: newUser.subscription,
		},
	});
};

const signin = async (req, res) => {
	const { password, email } = req.body;

	const user = await User.findOne({ email });
	if (!user) {
		throw HttpError(401, "Email or password is wrong");
	}

	const passwordCompare = await bcrypt.compare(password, user.password);
	if (!passwordCompare) {
		throw HttpError(401, "Email or password is wrong");
	}

	const payload = {
		id: user._id,
	};

	const token = jwt.sign(payload, JWT_KEY, { expiresIn: "23h" });
	await User.findByIdAndUpdate(user._id, { token });

	res.json({
		token,
		user: {
			email: user.email,
			subscription: user.subscription,
		},
	});
};

const signout = async (req, res) => {
	const { _id } = req.user;
	await User.findByIdAndUpdate(_id, { token: null });
	res.status(204).json();
};

const getCurrent = (req, res) => {
	const { email, subscription } = req.user;

	res.json({ email, subscription });
};

const updateSubscription = async (req, res) => {
	const { _id } = req.user;
	const user = await User.findByIdAndUpdate(_id, req.body, { new: true });
	if (!user) {
		throw HttpError(404);
	}
	res.json({
		user: {
			email: user.email,
			subscription: user.subscription,
		},
	});
};

export default {
	signup: controllerWrapper(signup),
	signin: controllerWrapper(signin),
	signout: controllerWrapper(signout),
	getCurrent: controllerWrapper(getCurrent),
	updateSubscription: controllerWrapper(updateSubscription),
};
