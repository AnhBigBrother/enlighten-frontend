"use server";

import { ActionResponse, preventAccessTokenExpired } from "@/actions/grpc/_utils";
import { GrpcCommentClient } from "@/actions/grpc/_utils";
import {
	CheckCommentInteractedRequest,
	CheckCommentInteractedResponse,
	DownVoteCommentRequest,
	DownVoteCommentResponse,
	ReplyCommentRequest,
	ReplyCommentResponse,
	UpVoteCommentRequest,
	UpVoteCommentResponse,
} from "@/grpc/protobuf/comment_service";
import { Metadata, status } from "@grpc/grpc-js";
import { cookies } from "next/headers";

export async function UpVoteComment(comment_id: string) {
	const cookieStore = await cookies();
	const access_token = cookieStore.get("access_token")?.value;
	if (!access_token) {
		return {
			error: {
				code: status.UNAUTHENTICATED,
				details: "access_token failed",
			},
		};
	}
	const client = GrpcCommentClient();
	const metadata = new Metadata();
	metadata.add("access_token", access_token);
	const req: UpVoteCommentRequest = {
		access_token,
		comment_id,
	};
	return preventAccessTokenExpired(cookieStore, metadata, () => {
		return new Promise<ActionResponse<UpVoteCommentResponse>>((resolve) => {
			client.upVoteComment(req, metadata, (err, res) => {
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
	});
}

export async function DownVoteComment(comment_id: string) {
	const cookieStore = await cookies();
	const access_token = cookieStore.get("access_token")?.value;
	if (!access_token) {
		return {
			error: {
				code: status.UNAUTHENTICATED,
				details: "access_token failed",
			},
		};
	}
	const client = GrpcCommentClient();
	const metadata = new Metadata();
	metadata.add("access_token", access_token);
	const req: DownVoteCommentRequest = {
		access_token,
		comment_id,
	};
	return preventAccessTokenExpired(cookieStore, metadata, () => {
		return new Promise<ActionResponse<DownVoteCommentResponse>>((resolve) => {
			client.downVoteComment(req, metadata, (err, res) => {
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
	});
}

export async function CheckCommentInteracted(comment_id: string) {
	const cookieStore = await cookies();
	const access_token = cookieStore.get("access_token")?.value;
	if (!access_token) {
		return {
			error: {
				code: status.UNAUTHENTICATED,
				details: "access_token failed",
			},
		};
	}
	const client = GrpcCommentClient();
	const metadata = new Metadata();
	metadata.add("access_token", access_token);
	const req: CheckCommentInteractedRequest = {
		access_token,
		comment_id,
	};
	return preventAccessTokenExpired(cookieStore, metadata, () => {
		return new Promise<ActionResponse<CheckCommentInteractedResponse>>((resolve) => {
			client.checkCommentInteracted(req, metadata, (err, res) => {
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
	});
}

export async function ReplyComment(comment_id: string, post_id: string, reply_body: string) {
	const cookieStore = await cookies();
	const access_token = cookieStore.get("access_token")?.value;
	if (!access_token) {
		return {
			error: {
				code: status.UNAUTHENTICATED,
				details: "access_token failed",
			},
		};
	}
	const client = GrpcCommentClient();
	const metadata = new Metadata();
	metadata.add("access_token", access_token);
	const req: ReplyCommentRequest = {
		access_token,
		post_id,
		comment_id,
		reply_body,
	};
	return preventAccessTokenExpired(cookieStore, metadata, () => {
		return new Promise<ActionResponse<ReplyCommentResponse>>((resolve) => {
			client.replyComment(req, metadata, (err, res) => {
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
	});
}
