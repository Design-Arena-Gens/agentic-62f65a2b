declare module 'sql.js' {
  export type Statement = {
    step: () => boolean;
    getAsObject: () => Record<string, unknown>;
    free: () => void;
  };

  export type Database = {
    exec: (sql: string) => void;
    run: (sql: string, params?: Array<string | number | null>) => void;
    prepare: (sql: string) => Statement;
    export: () => Uint8Array;
  };

  export type SqlJsInstance = {
    Database: new (data?: Uint8Array) => Database;
  };

  export type SqlJsLoaderConfig = {
    locateFile: (file: string) => string;
  };

  export default function initSqlJs(config: SqlJsLoaderConfig): Promise<SqlJsInstance>;
}
