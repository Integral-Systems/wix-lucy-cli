import { TaskOptions } from '../../schemas/gulp.js';
import { TaskType } from '../../schemas/types.js';
export declare function checkPages(fail: boolean, force: boolean): Promise<void>;
export declare function checkTs(options: TaskOptions): TaskType;
