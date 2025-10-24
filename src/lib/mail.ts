import { env } from '$env/dynamic/private';
import type { BetterAuthOptions } from 'better-auth';
import nodemailer from 'nodemailer';
import type Mail from 'nodemailer/lib/mailer';

const SMTP_HOST = env.SMTP_HOST;
const SMTP_PORT = env.SMTP_PORT ? parseInt(env.SMTP_PORT, 10) : undefined;
const SMTP_SECURE = env.SMTP_SECURE !== 'false';
const SMTP_USER = env.SMTP_USER;
const SMTP_PASSWORD = env.SMTP_PASSWORD;

if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
	console.error('SMTP configuration environment variables are not properly set.');
	process.exit(1);
}

const SENDER_MAIL = env.SENDER_MAIL;

if (!SENDER_MAIL) {
	console.error('SENDER_MAIL environment variable is not set.');
	process.exit(1);
}

const transporter = nodemailer.createTransport({
	host: SMTP_HOST,
	port: SMTP_PORT,
	secure: SMTP_SECURE,
	auth: {
		user: SMTP_USER,
		pass: SMTP_PASSWORD
	}
});

/**
 * Send an email using the configured SMTP transporter.
 *
 * @param opts Email options excluding the 'from' field.
 * @returns Promise resolving to the result of the sendMail operation.
 */
export async function sendEmail(opts: Exclude<Mail.Options, 'from'>) {
	return transporter.sendMail({
		...opts,
		from: `"bStats" <${SENDER_MAIL}>`
	});
}
