type TPostData = {
	id: string;
	title: string;
	content: string;
	author_id: string;
	author_name: string;
	author_email: string;
	author_image: string;
	created_at: string;
	updated_at: string;
	up_voted: number;
	down_voted: number;
	comments_count: number;
};

export { type TPostData };
