import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const app = require('../backend/app.js');

export default app;
