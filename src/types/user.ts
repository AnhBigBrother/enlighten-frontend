type TUserInfo = {
	id: string;
	email: string;
	name: string;
	image?: string;
	bio?: string;
	refresh_token?: string;
	created_at?: string;
	updated_at?: string;
};

type TUserOverview = {
	id: string;
	name: string;
	email: string;
	image?: string;
	bio?: string;
	total_posts: number;
	total_upvoted: number;
	total_downvoted: number;
	created_at: string;
	updated_at: string;
};

export { type TUserInfo, type TUserOverview };
