export interface LucyArgs {
    [x: string]: unknown;
    _: (string | number)[];
    $0: string;
    type?: 'velo' | 'expo' | 'blocks';
}
export declare function get_args(): Promise<LucyArgs>;
