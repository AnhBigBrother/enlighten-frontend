type TComment = {
	id: string;
	comment: string;
	post_id: string;
	author_id: string;
	author_name: string;
	author_email: string;
	author_image: string;
	parent_comment_id: string | null;
	up_voted: number;
	down_voted: number;
	created_at: string;
};

export { type TComment };
