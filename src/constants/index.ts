export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;
export const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL!;

export const COOKIE_AGE = 7 * 24 * 60 * 60;
export const TOAST_REMOVE_DELAY = 3000;
export const TOAST_LIMIT = 3;

export const GITHUB_GET_CONSENT_URL = "https://github.com/login/oauth/authorize";
export const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI!;
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;

export const GOOGLE_GET_CONSENT_URL = "https://accounts.google.com/o/oauth2/v2/auth";
export const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;

export const MICROSOFT_GET_CONSENT_URL =
	"https://login.microsoftonline.com/common/oauth2/v2.0/authorize";
export const MICROSOFT_REDIRECT_URI = process.env.MICROSOFT_REDIRECT_URI!;
export const MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID!;

export const DISCORD_GET_CONSENT_URL = "https://discord.com/oauth2/authorize";
export const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI!;
export const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
