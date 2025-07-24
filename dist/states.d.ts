import { Context, Ref } from "effect";
declare const ServiceInspectState_base: Context.TagClass<ServiceInspectState, "ServiceInspectState", Ref.Ref<String>>;
export declare class ServiceInspectState extends ServiceInspectState_base {
}
export declare const service_inspect_init: import("effect/Effect").Effect<Ref.Ref<any>, never, never>;
declare const NodeInspectState_base: Context.TagClass<NodeInspectState, "NodeInspectState", Ref.Ref<String>>;
export declare class NodeInspectState extends NodeInspectState_base {
}
export declare const node_inspect_init: import("effect/Effect").Effect<Ref.Ref<any>, never, never>;
export {};
