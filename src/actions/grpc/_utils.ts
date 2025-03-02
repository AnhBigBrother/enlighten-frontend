"use server";

import { BACKEND_DOMAIN, CA_CERT, COOKIE_AGE } from "@/constants";
import { GetAccessTokenRequest, GetAccessTokenResponse } from "@/grpc/protobuf/public_service";
import { Metadata, status } from "@grpc/grpc-js";
import { Status } from "@grpc/grpc-js/build/src/constants";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import * as publicService from "@/grpc/protobuf/public_service";
import * as oauthService from "@/grpc/protobuf/oauth_service";
import * as userService from "@/grpc/protobuf/user_service";
import * as postService from "@/grpc/protobuf/post_service";
import * as commentService from "@/grpc/protobuf/comment_service";
import * as gameService from "@/grpc/protobuf/game_service";
import * as grpc from "@grpc/grpc-js";

export type ActionResponse<T> = {
	data?: T;
	error?: {
		code: Status;
		details: string;
	};
};

export type SortType = "top" | "hot" | "new";

export const newAccessTokenCookie = async (
	cookieStore: ReadonlyRequestCookies,
): Promise<ActionResponse<GetAccessTokenResponse>> => {
	const refresh_token = cookieStore.get("refresh_token")?.value;
	if (!refresh_token) {
		return {
			error: {
				code: status.UNAUTHENTICATED,
				details: "refresh_token failed",
			},
		};
	}
	const client = GrpcPublicClient();
	const req: GetAccessTokenRequest = {
		refresh_token: refresh_token,
	};
	const res = await new Promise<ActionResponse<GetAccessTokenResponse>>((resolve) => {
		client.getAccessToken(req, (err, res) => {
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
	if (res.error || !res.data) {
		cookieStore.set("access_token", "", {
			sameSite: "strict",
			maxAge: -1,
		});
		cookieStore.set("refresh_token", "", {
			sameSite: "strict",
			maxAge: -1,
		});
		return res;
	}
	cookieStore.set("access_token", res.data.access_token, {
		httpOnly: true,
		secure: true,
		sameSite: "strict",
		maxAge: COOKIE_AGE,
	});
	return res;
};

export const preventAccessTokenExpired = async <T>(
	cookieStore: ReadonlyRequestCookies,
	metadata: Metadata,
	caller: () => Promise<ActionResponse<T>>,
) => {
	const res = await caller();
	if (
		res.error &&
		res.error.code === status.UNAUTHENTICATED &&
		res.error.details === "access_token failed"
	) {
		const tokens = await newAccessTokenCookie(cookieStore);
		metadata.set("access_token", tokens.data?.access_token || "");
		const res2 = await caller();
		return res2;
	}
	return res;
};

function loadTLSCreadential() {
	const certBuffer = Buffer.from(CA_CERT);
	return grpc.credentials.createSsl(certBuffer);
}

export const GrpcPublicClient = () => {
	return new publicService.PublicClient(BACKEND_DOMAIN, loadTLSCreadential());
};

export const GrpcOAuthClient = () => {
	return new oauthService.OauthClient(BACKEND_DOMAIN, loadTLSCreadential());
};

export const GrpcUserClient = () => {
	return new userService.UserClient(BACKEND_DOMAIN, loadTLSCreadential());
};

export const GrpcPostClient = () => {
	return new postService.PostClient(BACKEND_DOMAIN, loadTLSCreadential());
};

export const GrpcCommentClient = () => {
	return new commentService.CommentClient(BACKEND_DOMAIN, loadTLSCreadential());
};

export const GrpcGameClient = () => {
	return new gameService.GameClient(BACKEND_DOMAIN, loadTLSCreadential());
};
