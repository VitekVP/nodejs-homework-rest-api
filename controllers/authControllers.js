import bcrypt from "bcrypt";
import "dotenv/config";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import Jimp from "jimp";

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

	const avatarURL = gravatar.url(email);

	const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL });
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

const avatarPath = path.resolve("public", "avatars");
const updateAvatar = async (req, res) => {
	const { path: oldPath, originalname } = req.file;

	const avatarFile = await Jimp.read(oldPath);
	await avatarFile.resize(250, 250).writeAsync(oldPath);

	const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
	const fileName = `${uniquePrefix}_${originalname}`;
	const newPath = path.join(avatarPath, fileName);
	await fs.rename(oldPath, newPath);

	const avatarURL = path.join("avatars", fileName);
	const { _id } = req.user;
	await User.findByIdAndUpdate(_id, { avatarURL });

	res.json({ avatarURL });
};

export default {
	signup: controllerWrapper(signup),
	signin: controllerWrapper(signin),
	signout: controllerWrapper(signout),
	getCurrent: controllerWrapper(getCurrent),
	updateSubscription: controllerWrapper(updateSubscription),
	updateAvatar: controllerWrapper(updateAvatar),
};
