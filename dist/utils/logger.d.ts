export declare const orange: import("chalk").ChalkInstance;
export declare const blue: import("chalk").ChalkInstance;
export declare const green: import("chalk").ChalkInstance;
export declare const red: import("chalk").ChalkInstance;
export declare const yellow: import("chalk").ChalkInstance;
export declare const magenta: import("chalk").ChalkInstance;
export declare const logger: {
    success: (message: string, ...optionalParams: any[]) => void;
    info: (message: string, ...optionalParams: any[]) => void;
    action: (message: string, ...optionalParams: any[]) => void;
    exception: (message: string, ...optionalParams: any[]) => void;
    error: (message: string, ...optionalParams: any[]) => void;
    warning: (message: string, ...optionalParams: any[]) => void;
    alert: (message: string, ...optionalParams: any[]) => void;
    report: (message: string, ...optionalParams: any[]) => void;
    kill: (message: string, ...optionalParams: any[]) => void;
};
