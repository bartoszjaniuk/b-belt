import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
	js.configs.recommended,
	...tseslint.configs.recommended,
	eslintConfigPrettier,
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		ignores: ["dist/", "node_modules/", "*.config.*"],
	},
];
