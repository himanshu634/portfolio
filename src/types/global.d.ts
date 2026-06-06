// Ambient declarations for global stylesheet side-effect imports
// (e.g. `import "./globals.css"`).
//
// Next.js ships types for CSS Modules (`*.module.css`) but not for plain global
// stylesheets, so the TypeScript language server reports "Cannot find module or
// type declarations for side-effect import" on `globals.css`. These keep the
// editor and `tsc` in agreement. The more specific `*.module.css` declaration
// from Next still wins for CSS Modules.

declare module "*.css";
declare module "*.scss";
declare module "*.sass";
