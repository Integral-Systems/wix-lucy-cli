export type TSConfig = {
    compilerOptions?: {
        target?: string; // e.g., "ES5", "ES6", "ES2015", "ESNext"
        module?: string; // e.g., "CommonJS", "ES6", "ESNext"
        lib?: string[]; // e.g., ["ES2015", "DOM"]
        outDir?: string;
        rootDir?: string;
        strict?: boolean;
        esModuleInterop?: boolean;
        allowJs?: boolean;
        checkJs?: boolean;
        declaration?: boolean;
        declarationMap?: boolean;
        sourceMap?: boolean;
        removeComments?: boolean;
        noImplicitAny?: boolean;
        moduleResolution?: "node" | "classic";
        resolveJsonModule?: boolean;
        skipLibCheck?: boolean;
        types?: string[]; // e.g., ["node", "jest"]
        typeRoots?: string[]; // e.g., ["./types"]
        jsx?: "preserve" | "react" | "react-jsx" | "react-jsxdev" | "react-native";
        incremental?: boolean;
        noEmit?: boolean;
        paths?: Record<string, string[]>; // Aliases for module paths
        [key: string]: any; // Allow additional compiler options
    };
    include?: string[]; // Glob patterns to include
    exclude?: string[]; // Glob patterns to exclude
    files?: string[]; // Specific files to include
    extends?: string; // Path to a base tsconfig.json
    references?: { path: string }[]; // Project references
    compileOnSave?: boolean;
    [key: string]: any; // Allow additional top-level options
};
