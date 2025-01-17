"use client";

import {
	getSavedThemeColor,
	setGlobalColorTheme,
	ThemeColors,
	ThemeColorStateParams,
} from "@/lib/theme-colors";
import { ThemeProviderProps, useTheme } from "next-themes";
import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext<ThemeColorStateParams>({} as ThemeColorStateParams);

export function ThemeColorProvider({ children }: ThemeProviderProps) {
	const { theme } = useTheme();
	const [themeColor, setThemeColor] = useState<ThemeColors>(
		getSavedThemeColor() as ThemeColors,
	);
	const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light");

	useEffect(() => {
		if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
			setSystemTheme("dark");
		}

		const detectSystemTheme = (event: MediaQueryListEvent) => {
			setSystemTheme(event.matches ? "dark" : "light");
		};
		window
			.matchMedia("(prefers-color-scheme: dark)")
			.addEventListener("change", detectSystemTheme);

		return () => {
			window
				.matchMedia("(prefers-color-scheme: dark)")
				.removeEventListener("change", detectSystemTheme);
		};
	}, []);

	useEffect(() => {
		if (theme === "light" || theme === "dark") {
			localStorage.setItem("themeColor", themeColor);
			setGlobalColorTheme(theme, themeColor);
		} else {
			localStorage.setItem("themeColor", themeColor);
			setGlobalColorTheme(systemTheme, themeColor);
		}
	}, [themeColor, theme, systemTheme]);

	return (
		<ThemeContext.Provider value={{ themeColor, setThemeColor }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useThemeContext() {
	return useContext(ThemeContext);
}
