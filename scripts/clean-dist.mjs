import { rm } from 'node:fs/promises';

// Resolve relative to this script, so only this project's build output is removed.
await rm(new URL('../dist/', import.meta.url), { recursive: true, force: true });
