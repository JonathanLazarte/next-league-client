import js from "@eslint/js";
import tseslint from "typescript-eslint";
import nextPlugin from "@next/next";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked, // Nivel estricto para TypeScript
  ...tseslint.configs.stylisticTypeChecked, // Evalúa consistencia de estilo
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      "no-console": "error", // Cambia a 'error' para que no pase ningún console.log
      "@typescript-eslint/no-explicit-any": "error", // Prohibido usar 'any'
    },
  }
);
