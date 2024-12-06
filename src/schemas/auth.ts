import { z } from "zod";

const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6, {
		message: "Password must be 6 characters or longer",
	}),
});
const SignupSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6, {
		message: "Password must be 6 characters or longer",
	}),
	name: z
		.string()
		.min(3, {
			message: "Name must be 3 characters or longer",
		})
		.max(30, {
			message: "Name must be less than 30 characters",
		}),
	image: z.string().optional(),
});
type LoginDTO = z.infer<typeof LoginSchema>;
type SignupDTO = z.infer<typeof SignupSchema>;

export { LoginSchema, SignupSchema, type LoginDTO, type SignupDTO };
