import bcrypt from "bcrypt";
import "dotenv/config";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import Jimp from "jimp";
import { nanoid } from "nanoid";

import User from "../models/user.js";
import { HttpError, sendEmail } from "../helpers/index.js";
import { controllerWrapper } from "../decorators/index.js";

const { JWT_KEY, BASE_URL } = process.env;

const signup = async (req, res) => {
	const { password, email } = req.body;

	const user = await User.findOne({ email });
	if (user) {
		throw HttpError(409, "Email in use");
	}

	const hashPassword = await bcrypt.hash(password, 10);

	const avatarURL = gravatar.url(email);

	const verificationToken = nanoid();

	const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken });

	const verifyEmail = {
		to: email,
		subject: "Verify you email",
		html: `<a href="${BASE_URL}/users/verify/${verificationToken}" target="_blank"> Click verify email</a>`,
	};

	await sendEmail(verifyEmail);

	res.status(201).json({
		user: {
			email: newUser.email,
			subscription: newUser.subscription,
		},
	});
};

const verify = async (req, res) => {
	const { verificationToken } = req.params;

	const user = await User.findOne({ verificationToken });

	if (!user) {
		throw HttpError(404, "User not found");
	}

	await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" });

	res.json({ message: "Verification successful" });
};

const resendVerify = async (req, res) => {
	const { email } = req.body;

	const user = await User.findOne({ email });
	if (!user) {
		throw HttpError(404, "User not found");
	}
	if (user.verify) {
		throw HttpError(400, "Verification has already been passed");
	}

	const verifyEmail = {
		to: email,
		subject: "Verify you email",
		html: `<a href="${BASE_URL}/users/verify/${user.verificationToken}" target="_blank"> Click verify email</a>`,
	};

	await sendEmail(verifyEmail);

	res.json({ message: "Verification email sent" });
};

const signin = async (req, res) => {
	const { password, email } = req.body;

	const user = await User.findOne({ email });
	if (!user) {
		throw HttpError(401, "Email or password is wrong");
	}

	if (!user.verify) {
		throw HttpError(401, "Email not verify");
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
	verify: controllerWrapper(verify),
	resendVerify: controllerWrapper(resendVerify),
	signin: controllerWrapper(signin),
	signout: controllerWrapper(signout),
	getCurrent: controllerWrapper(getCurrent),
	updateSubscription: controllerWrapper(updateSubscription),
	updateAvatar: controllerWrapper(updateAvatar),
};
