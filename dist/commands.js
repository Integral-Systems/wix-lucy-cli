import { Effect } from "effect";
import { exec as execCallback } from "child_process";
import { AppError } from "./error.js";
import { parse_error } from "./helpers.js";
import { promisify } from 'util';
import { default_docker_retry } from "./policy.js";
const exec = promisify(execCallback);
export const init_expo = () => Effect.gen(function* () {
    const format = "{{.ID}}\\t{{.Name}}\\t{{.Mode}}\\t{{.Replicas}}\\t{{.Image}}\\t{{.Ports}}";
    const command = `docker service ls --format "${format}"`;
    const res = yield* Effect.retry(Effect.tryPromise({
        try: () => exec(command, { encoding: 'utf8' }),
        catch: (error) => new AppError({ cause: parse_error(error), message: "Error getting services" })
    }), default_docker_retry);
    if (res.stderr) {
        yield* Effect.logError(`Command "${command}" produced stderr: ${res.stderr}`);
    }
});
//# sourceMappingURL=commands.js.map