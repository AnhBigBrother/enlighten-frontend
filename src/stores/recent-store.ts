import createSelectors from "@/stores/selector";
import { create } from "zustand";

export type TRecent = {
	id: string;
	title: string;
	up_voted: number;
	down_voted: number;
	comment_count: number;
	author_id: string;
	author_name: string;
	author_image: string;
};

export type TRecentStore = {
	recents: TRecent[];
	add: (newUser: TRecent) => void;
	reset: () => void;
};

const useRecentStoreBase = create<TRecentStore>()((set) => ({
	recents: [],
	add: (newPost: TRecent) =>
		set((state) => {
			const arr: TRecent[] = [newPost];
			for (let post of state.recents) {
				if (post.id !== newPost.id) {
					arr.push(post);
				}
			}
			return {
				recents: arr,
			};
		}),
	reset: () => set({ recents: [] }),
}));

const useRecentStore = createSelectors(useRecentStoreBase);

export default useRecentStore;
