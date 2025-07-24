import { ManagedRuntime } from "effect";
import { get_args } from "./args.js";
import { NodeInspectState, ServiceInspectState } from "./states.js";
import { NodeContext } from "@effect/platform-node";
export declare const build_runtime: (args: Awaited<ReturnType<typeof get_args>>) => ManagedRuntime.ManagedRuntime<import("./config.js").Config | ServiceInspectState | NodeInspectState | NodeContext.NodeContext, never>;
