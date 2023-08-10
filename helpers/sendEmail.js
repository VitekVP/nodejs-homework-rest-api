import nodemailer from "nodemailer";

const { UKRNET_EMAIL, UKRNET_PASSWORD } = process.env;

const nodemailerConfig = {
	host: "smtp.ukr.net",
	port: 2525,
	secure: true,
	auth: {
		user: UKRNET_EMAIL,
		pass: UKRNET_PASSWORD,
	},
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async data => {
	const email = { ...data, from: UKRNET_EMAIL };

	try {
		await transport.sendMail(email);
		return true;
	} catch (error) {
		console.log(error.message);
	}
};

export default sendEmail;

// const email = {
// 	from: UKRNET_EMAIL,
// 	to: "kihep54599@viperace.com",
// 	subject: "Test email",
// 	html: <strong>Test email</strong>,
// };
