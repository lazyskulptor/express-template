import 'module-alias/register';
import app from "./app";

const init = (): void => {
  app.listen(process.env.WEB_PORT,()=>console.log(`listening ${process.env.WEB_PORT}`));
};

init();