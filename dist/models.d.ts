export type TSConfig = {
    compilerOptions?: {
        target?: string;
        module?: string;
        lib?: string[];
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
        types?: string[];
        typeRoots?: string[];
        jsx?: "preserve" | "react" | "react-jsx" | "react-jsxdev" | "react-native";
        incremental?: boolean;
        noEmit?: boolean;
        paths?: Record<string, string[]>;
        [key: string]: any;
    };
    include?: string[];
    exclude?: string[];
    files?: string[];
    extends?: string;
    references?: {
        path: string;
    }[];
    compileOnSave?: boolean;
    [key: string]: any;
};
