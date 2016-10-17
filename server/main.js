import Koa from 'koa';
import serve from 'koa-static';
import path from 'path';

/**
 * Initialise KOA and serve directly from main directory.
 */
const app = new Koa();
app.use(serve(path.resolve(__dirname, '..')));

export default app;