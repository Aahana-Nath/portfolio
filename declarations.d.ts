// Declare CSS modules so TypeScript accepts side-effect imports like `import './globals.css'`
declare module '*.css' {
  const styles: Record<string, string>
  export default styles
}
