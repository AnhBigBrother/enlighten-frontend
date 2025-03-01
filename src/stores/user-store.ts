import { GetSessionResponse } from "@/grpc/protobuf/user_service";
import createSelectors from "@/stores/selector";
import { create } from "zustand";

export type UserSession = GetSessionResponse | null;

export type TUserStore = {
	user: UserSession;
	update: (newUser: UserSession) => void;
	reset: () => void;
};

const useUserStoreBase = create<TUserStore>()((set) => ({
	user: null,
	update: (newUser: UserSession) => set({ user: newUser }),
	reset: () => set({ user: null }),
}));
const useUserStore = createSelectors(useUserStoreBase);

export default useUserStore;
