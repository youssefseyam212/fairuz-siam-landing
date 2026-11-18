// Minimal typings for Node's built-in SQLite (Node >= 22.13). @types/node 20 does not ship them.
declare module 'node:sqlite' {
  type Value = string | number | bigint | null | Uint8Array;
  export class StatementSync {
    run(...params: Value[]): { changes: number | bigint; lastInsertRowid: number | bigint };
    get(...params: Value[]): Record<string, Value> | undefined;
    all(...params: Value[]): Record<string, Value>[];
  }
  export class DatabaseSync {
    constructor(path: string);
    exec(sql: string): void;
    prepare(sql: string): StatementSync;
    close(): void;
  }
}
