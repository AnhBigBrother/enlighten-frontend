import { BACKEND_DOMAIN, CA_CERT } from "@/constants";
import * as publicService from "@/grpc/protobuf/public_service";
import * as oauthService from "@/grpc/protobuf/oauth_service";
import * as userService from "@/grpc/protobuf/user_service";
import * as postService from "@/grpc/protobuf/post_service";
import * as commentService from "@/grpc/protobuf/comment_service";
import * as gameService from "@/grpc/protobuf/game_service";
import * as grpc from "@grpc/grpc-js";

function loadTLSCreadential() {
	const cert = CA_CERT;
	if (!cert) {
		throw Error("cannot load grpc server certificte");
	}
	const certBuffer = Buffer.from(cert);
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
