import createSelectors from "@/stores/selector";
import { create } from "zustand";

export type TUser = {
	email: string;
	name: string;
	id: number | string;
	image?: string;
	exp?: number;
	iat?: number;
} | null;

export type TUserStore = {
	user: TUser;
	update: (newUser: TUser) => void;
	reset: () => void;
};

const useUserStoreBase = create<TUserStore>()((set) => ({
	user: null,
	update: (newUser: TUser) => set({ user: newUser }),
	reset: () => set({ user: null }),
}));
const useUserStore = createSelectors(useUserStoreBase);

export default useUserStore;
