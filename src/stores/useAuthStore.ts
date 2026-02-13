import { loadFromStorage, removeFromStorage } from "@/utils/storage";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
	state: () => ({
		token: loadFromStorage("token") as string | null,
		user: JSON.parse(loadFromStorage("user") || "null") as any,
	}),
	getters: {
		isAuthenticated: (state) => !!state.token,
		isAdmin: (state) => state.user?.role === "admin",
	},
	actions: {
		logout() {
			this.user = null;
			this.token = null;
			removeFromStorage("token");
			removeFromStorage("user");
		},
	},
});
