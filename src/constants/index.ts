export const BACKEND_DOMAIN = process.env.BACKEND_DOMAIN!;
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;
export const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL!;

export const CA_CERT = process.env.CA_CERT!;

export const COOKIE_AGE = 7 * 24 * 60 * 60;
export const TOAST_REMOVE_DELAY = 3000;
export const TOAST_LIMIT = 3;

export const GITHUB_GET_CONSENT_URL = "https://github.com/login/oauth/authorize";
export const GITHUB_GET_TOKEN_URL = "https://github.com/login/oauth/access_token";
export const GITHUB_GET_USER_INFO_URL = "https://api.github.com/user";
export const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI!;
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;

export const GOOGLE_GET_CONSENT_URL = "https://accounts.google.com/o/oauth2/v2/auth";
export const GOOGLE_GET_TOKEN_URL = "https://oauth2.googleapis.com/token";
export const GOOGLE_GET_USER_INFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";
export const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

export const MICROSOFT_GET_CONSENT_URL =
	"https://login.microsoftonline.com/common/oauth2/v2.0/authorize";
export const MICROSOFT_GET_TOKEN_URL =
	"https://login.microsoftonline.com/common/oauth2/v2.0/token";
export const MICROSOFT_GET_USER_INFO_URL = "https://graph.microsoft.com/oidc/userinfo";
export const MICROSOFT_REDIRECT_URI = process.env.MICROSOFT_REDIRECT_URI!;
export const MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID!;
export const MICROSOFT_CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET!;

export const DISCORD_GET_CONSENT_URL = "https://discord.com/oauth2/authorize";
export const DISCORD_GET_TOKEN_URL = "https://discord.com/api/v10/oauth2/token";
export const DISCORD_GET_USER_INFO_URL = "https://discord.com/api/v10/oauth2/@me";
export const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI!;
export const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
export const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
