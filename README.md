# Node.JS Express Template with Mikro-ORM
## Main dependent Library
- [mikro-orm](https://mikro-orm.io) for persistance layer and documentation
- [tsoa](https://github.com/lukeautry/tsoa) for presentation layer
- [module-alias](https://github.com/ilearnio/module-alias) to manage modules
- [jest](https://jestjs.io) for unit test
- [supertest]([https://jestjs.io](https://github.com/ladjs/supertest)) for e2e test

## Run Application
### Run and configure application
- Create and configure .env file for local environment  
  - To run with sqlite, please refer [`.env.test`](.env.test) file
  - To run with mysql, check mysql service is running and configure like [`.env.dev`](.env.dev) file
- All configurations for Database are applied in file [`repo-context.ts`](src/repo/repo-context.ts)
- Now app can be run with below command
``` bash
npm run dev:start
```
- Please check [`pakcage.json`](package.json) for all runnable script

### Migrate Database
- Migration is triggered in `index.ts` or `global-suite.ts` files
- Sqlite migration files are always created with initialized option and won't be saved
- With MySQL, migration file must be created manually, When definetion of entities or decorators are changed  
  - Before command, Database is configured properly as MySQL  
  Please refer [Official Website of Mikro-ORM](https://mikro-orm.io/docs/migrations)
``` bash 
# Only at first time
npx mikro-orm migration:create --initial

npx mikro-orm migration:create
```

### Routers
> **Note**  
> `routes.ts`, `swagger.json` files are generaged with tsoa library.  
> When files aren't generaged, `app.ts` file would errors.  
> For example when just download this project.  
> Then build or generate with commands `npm run build` or `npm run routes`
