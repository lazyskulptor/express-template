import { defineConfig } from '@mikro-orm/core';
import { basicOption } from '@/repo/repo-context';

console.debug(basicOption);
export default defineConfig(basicOption);
