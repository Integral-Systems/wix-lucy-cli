import { Context, Ref } from "effect"


export class ServiceInspectState extends Context.Tag("ServiceInspectState")<
ServiceInspectState,
  Ref.Ref<String>
>() {}
export const service_inspect_init = Ref.make([] as any)

export class NodeInspectState extends Context.Tag("NodeInspectState")<
NodeInspectState,
  Ref.Ref<String>
>() {}
export const node_inspect_init = Ref.make([] as any)

