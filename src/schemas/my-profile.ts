import { z } from "zod";

const MyProfileSchema = z
	.object({
		name: z
			.string()
			.min(3, {
				message: "Name must be 3 characters or longer",
			})
			.max(30, {
				message: "Name must be less than 30 characters",
			}),
		image: z.string(),
		newPassword: z.string().refine((newPwd: string) => newPwd === "" || newPwd.length >= 6, {
			message: "Password must be 6 characters or longer",
		}),
		confirmPassword: z.string(),
		bio: z.string().refine((bio) => bio !== null && bio.length <= 255, {
			message: "Bio must in range 0-255 characters",
		}),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Password does not match",
		path: ["confirmPassword"],
	});

type MyProfileDTO = z.infer<typeof MyProfileSchema>;

export { MyProfileSchema, type MyProfileDTO };
