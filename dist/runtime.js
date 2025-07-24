import { Layer, Logger, LogLevel, ManagedRuntime } from "effect";
import { ConfigLayer } from "./config.js";
import { NodeInspectState, ServiceInspectState, node_inspect_init, service_inspect_init } from "./states.js";
import { NodeContext } from "@effect/platform-node";
export const build_runtime = (args) => {
    const log_level = process.env.DEBUG === "true" ? LogLevel.Debug : LogLevel.Info;
    return ManagedRuntime.make(Layer.mergeAll(ConfigLayer(args), Layer.effect(ServiceInspectState, service_inspect_init), Layer.effect(NodeInspectState, node_inspect_init), NodeContext.layer, Logger.minimumLogLevel(log_level), Logger.replace(Logger.defaultLogger, Logger.prettyLogger({
        colors: true,
        mode: 'tty'
    }))));
};
