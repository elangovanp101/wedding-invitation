// Ambient declarations for CSS imports that TypeScript's module resolution can't infer on its
// own. CSS Modules (*.module.css) get real typed exports from Next's own plugin; this only
// covers plain side-effect stylesheet imports like `import '../styles/globals.css'`.
declare module '*.css';
