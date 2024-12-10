"use server";

/*<---validate login/signup form-input on server--->*/

import { _post } from "@/lib/fetch";
import { LoginDTO, LoginSchema, SignupDTO, SignupSchema } from "@/schemas/auth";
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
		const data = await _post("api/v1/user/signin", { body: result.data });
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
		const data = await _post("api/v1/user/signup", { body: result.data });
		return data;
	} catch (error: any) {
		console.error(error);
		if (error.error) {
			return error;
		}
		return { message: "Something went wrong", error: "Sign up failed" };
	}
};
