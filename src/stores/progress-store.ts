import createSelectors from "@/stores/selector";
import { create } from "zustand";

export type TProgressStore = {
	progress: number;
	update: (value: number) => void;
	reset: () => void;
};

const useProgressStoreBase = create<TProgressStore>()((set) => ({
	progress: 0,
	update: (value: number) => set({ progress: value }),
	reset: () => set({ progress: 0 }),
}));
const useProgressStore = createSelectors(useProgressStoreBase);

export default useProgressStore;
