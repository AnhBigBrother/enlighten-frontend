"use server";

/*<---validate login/signup form-input on server--->*/

import { BACKEND_URL, COOKIE_AGE } from "@/constants";
import { _post } from "@/lib/fetch";
import { LoginDTO, LoginSchema, SignupDTO, SignupSchema } from "@/schemas/auth";
import { cookies } from "next/headers";
import { fromZodError } from "zod-validation-error";

export const Login = async (dto: LoginDTO) => {
	try {
		const result = LoginSchema.safeParse(dto);
		if (!result.success) {
			throw {
				message: fromZodError(result.error).toString().slice(18),
				error: "Validation error",
			};
		}
		const data = await _post("api/v1/api/v1/user/signin", { body: result.data });
		const cookieStore = await cookies();
		cookieStore.set("access_token", data.access_token, {
			maxAge: COOKIE_AGE,
			httpOnly: true,
			secure: true,
			sameSite: "none",
		});
		cookieStore.set("refresh_token", data.refresh_token, {
			maxAge: COOKIE_AGE,
			httpOnly: true,
			secure: true,
			sameSite: "none",
		});
		return data;
	} catch (error: any) {
		console.error(error);
		if (error.error) {
			return error;
		}
		return { message: "Something went wrong", error: "Login failed" };
	}
};

export const Signup = async (dto: SignupDTO) => {
	try {
		const result = SignupSchema.safeParse(dto);
		if (!result.success) {
			throw {
				message: fromZodError(result.error).toString().slice(18),
				error: "Validation error",
			};
		}
		const data = await _post("api/v1/api/v1/user/signup", { body: result.data });
		const cookieStore = await cookies();
		cookieStore.set("access_token", data.access_token, {
			maxAge: COOKIE_AGE,
			httpOnly: true,
			secure: true,
			sameSite: "none",
		});
		cookieStore.set("refresh_token", data.refresh_token, {
			maxAge: COOKIE_AGE,
			httpOnly: true,
			secure: true,
			sameSite: "none",
		});
		return data;
	} catch (error: any) {
		console.error(error);
		if (error.error) {
			return error;
		}
		return { message: "Something went wrong", error: "Sign up failed" };
	}
};
