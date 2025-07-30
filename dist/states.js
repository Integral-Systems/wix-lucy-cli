import { Context, Ref } from "effect";
export class ServiceInspectState extends Context.Tag("ServiceInspectState")() {
}
export const service_inspect_init = Ref.make([]);
export class NodeInspectState extends Context.Tag("NodeInspectState")() {
}
export const node_inspect_init = Ref.make([]);
//# sourceMappingURL=states.js.map