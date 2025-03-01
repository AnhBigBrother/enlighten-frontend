"use server";

import { ActionResponse } from "@/actions/grpc/_utils";
import { GrpcOAuthClient } from "@/grpc/clients";
import {
	OauthDiscordRequest,
	OauthDiscordResponse,
	OauthGithubRequest,
	OauthGithubResponse,
	OauthGoogleRequest,
	OauthGoogleResponse,
	OauthMicrosoftRequest,
	OauthMicrosoftResponse,
} from "@/grpc/protobuf/oauth_service";

export async function OauthGoogle(
	access_token: string,
	token_type: string,
): Promise<ActionResponse<OauthGoogleResponse>> {
	const client = GrpcOAuthClient();
	const req: OauthGoogleRequest = {
		access_token,
		token_type,
	};
	return new Promise((resolve) => {
		client.oauthGoogle(req, (err, res) => {
			if (err !== null) {
				return resolve({
					error: {
						code: err.code,
						details: err.details,
					},
				});
			}
			return resolve({ data: res });
		});
	});
}

export async function OauthGithub(
	access_token: string,
	token_type: string,
): Promise<ActionResponse<OauthGithubResponse>> {
	const client = GrpcOAuthClient();
	const req: OauthGithubRequest = {
		access_token,
		token_type,
	};
	return new Promise((resolve) => {
		client.oauthGithub(req, (err, res) => {
			if (err !== null) {
				return resolve({
					error: {
						code: err.code,
						details: err.details,
					},
				});
			}
			return resolve({ data: res });
		});
	});
}

export async function OauthMicrosoft(
	access_token: string,
	token_type: string,
): Promise<ActionResponse<OauthMicrosoftResponse>> {
	const client = GrpcOAuthClient();
	const req: OauthMicrosoftRequest = {
		access_token,
		token_type,
	};
	return new Promise((resolve) => {
		client.oauthMicrosoft(req, (err, res) => {
			if (err !== null) {
				return resolve({
					error: {
						code: err.code,
						details: err.details,
					},
				});
			}
			return resolve({ data: res });
		});
	});
}

export async function OauthDiscord(
	access_token: string,
	token_type: string,
): Promise<ActionResponse<OauthDiscordResponse>> {
	const client = GrpcOAuthClient();
	const req: OauthDiscordRequest = {
		access_token,
		token_type,
	};
	return new Promise((resolve) => {
		client.oauthDiscord(req, (err, res) => {
			if (err !== null) {
				return resolve({
					error: {
						code: err.code,
						details: err.details,
					},
				});
			}
			return resolve({ data: res });
		});
	});
}
