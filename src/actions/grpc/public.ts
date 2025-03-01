"use server";

import { ActionResponse, SortType } from "@/actions/grpc/_utils";
import { COOKIE_AGE } from "@/constants";
import { GrpcPublicClient } from "@/grpc/clients";
import {
	GetAllPostsRequest,
	GetAllPostsResponse,
	GetCommentRepliesRequest,
	GetCommentRepliesResponse,
	GetPostByIdRequest,
	GetPostByIdResponse,
	GetPostCommentsRequest,
	GetPostCommentsResponse,
	GetTopUsersRequest,
	GetTopUsersResponse,
	GetUserOverviewRequest,
	GetUserOverviewResponse,
	GetUserPostsRequest,
	GetUserPostsResponse,
	SignInRequest,
	SignInResponse,
	SignUpRequest,
	SignUpResponse,
} from "@/grpc/protobuf/public_service";
import { cookies } from "next/headers";

export async function SignUp(req: SignUpRequest): Promise<ActionResponse<SignUpResponse>> {
	const cookieStore = await cookies();
	const client = GrpcPublicClient();
	return new Promise((resolve) => {
		client.signUp(req, (err, res) => {
			if (err !== null) {
				return resolve({
					error: {
						code: err.code,
						details: err.details,
					},
				});
			}
			cookieStore.set("access_token", res.access_token, {
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				maxAge: COOKIE_AGE,
			});
			cookieStore.set("refresh_token", res.refresh_token, {
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				maxAge: COOKIE_AGE,
			});
			return resolve({ data: res });
		});
	});
}

export async function SignIn(req: SignInRequest): Promise<ActionResponse<SignInResponse>> {
	const cookieStore = await cookies();
	const client = GrpcPublicClient();
	return new Promise((resolve) => {
		client.signIn(req, (err, res) => {
			if (err !== null) {
				return resolve({
					error: {
						code: err.code,
						details: err.details,
					},
				});
			}
			cookieStore.set("access_token", res.access_token, {
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				maxAge: COOKIE_AGE,
			});
			cookieStore.set("refresh_token", res.refresh_token, {
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				maxAge: COOKIE_AGE,
			});
			return resolve({ data: res });
		});
	});
}

export async function GetUserOverview(
	user_id: string,
): Promise<ActionResponse<GetUserOverviewResponse>> {
	const req: GetUserOverviewRequest = {
		user_id,
	};
	const client = GrpcPublicClient();
	return new Promise((resolve) => {
		client.getUserOverview(req, (err, res) => {
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

export async function GetUserPosts(
	req: GetUserPostsRequest,
): Promise<ActionResponse<GetUserPostsResponse["posts"]>> {
	const client = GrpcPublicClient();
	return new Promise((resolve) => {
		client.getUserPosts(req, (err, res) => {
			if (err !== null) {
				return resolve({
					error: {
						code: err.code,
						details: err.details,
					},
				});
			}
			return resolve({ data: res.posts });
		});
	});
}

export async function GetAllPosts(
	sort: SortType,
	limit: number,
	offset: number,
): Promise<ActionResponse<GetAllPostsResponse["posts"]>> {
	const req: GetAllPostsRequest = {
		sort: sort,
		limit,
		offset,
	};
	const client = GrpcPublicClient();
	return new Promise((resolve) => {
		client.getAllPosts(req, (err, res) => {
			if (err !== null) {
				return resolve({
					error: {
						code: err.code,
						details: err.details,
					},
				});
			}
			return resolve({ data: res.posts });
		});
	});
}

export async function GetPostById(
	post_id: string,
): Promise<ActionResponse<GetPostByIdResponse["post"]>> {
	const req: GetPostByIdRequest = {
		post_id,
	};
	const client = GrpcPublicClient();
	return new Promise((resolve) => {
		client.getPostById(req, (err, res) => {
			if (err !== null) {
				return resolve({
					error: {
						code: err.code,
						details: err.details,
					},
				});
			}
			return resolve({ data: res.post });
		});
	});
}

export async function GetPostComments(
	req: GetPostCommentsRequest,
): Promise<ActionResponse<GetPostCommentsResponse["comments"]>> {
	const client = GrpcPublicClient();
	return new Promise((resolve) => {
		client.getPostComments(req, (err, res) => {
			if (err !== null) {
				return resolve({
					error: {
						code: err.code,
						details: err.details,
					},
				});
			}
			return resolve({ data: res.comments });
		});
	});
}

export async function GetCommentReplies(
	req: GetCommentRepliesRequest,
): Promise<ActionResponse<GetCommentRepliesResponse["replies"]>> {
	const client = GrpcPublicClient();
	return new Promise((resolve) => {
		client.getCommentReplies(req, (err, res) => {
			if (err !== null) {
				return resolve({
					error: {
						code: err.code,
						details: err.details,
					},
				});
			}
			return resolve({ data: res.replies });
		});
	});
}

export async function GetTopUsers(
	limit: number,
	offset: number,
): Promise<ActionResponse<GetTopUsersResponse["users"]>> {
	const client = GrpcPublicClient();
	const req: GetTopUsersRequest = {
		limit,
		offset,
	};
	return new Promise((resolve) => {
		client.getTopUsers(req, (err, res) => {
			if (err !== null) {
				return resolve({
					error: {
						code: err.code,
						details: err.details,
					},
				});
			}
			return resolve({ data: res.users });
		});
	});
}
