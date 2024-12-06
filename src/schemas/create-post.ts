import { z } from "zod";

const CreatePostSchema = z.object({
	title: z
		.string()
		.min(1, {
			message: "Please fill out this field.",
		})
		.max(300, {
			message: "Title too long, please write less than 300 characters.",
		}),
	content: z.string().min(1, {
		message: "Please fill out this field.",
	}),
});

type CreatePostDTO = z.infer<typeof CreatePostSchema>;

export { CreatePostSchema, type CreatePostDTO };
