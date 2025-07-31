import { TaskOptions } from '../../schemas/gulp.js';
export declare function watchSCSS(): import("fs").FSWatcher;
export declare function watchBackend(): import("fs").FSWatcher;
export declare function watchPublic(): import("fs").FSWatcher;
export declare function watchPages(): import("fs").FSWatcher;
export declare function watchFiles(): import("fs").FSWatcher;
export declare function watchTemplates(): import("fs").FSWatcher;
export declare function watchTypes(): import("fs").FSWatcher;
export declare function watchAll(options: TaskOptions): import("undertaker").TaskFunction;
