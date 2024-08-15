export type KnownSchemaVersion = string;

export type SchemaVersion =
  | KnownSchemaVersion
  | 'latest'
  | undefined;
