export function unreachable(state: never): never {
    throw new Error(`This state should be unreachable: ${state} `);
}
