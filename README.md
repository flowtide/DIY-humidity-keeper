#DIY Humidity Management

## Table of contents

* [Development Memo](#overview)

## <a name="overview"/>Development Memo

* Setup Development Environment
```
npm -g install typescript
npm -g install express-generator-typescript
npm –g install @vue/cli
```

* Create Typescrpt Project
```
express-generator-typescript humidity_keeper
```

* Run <humidity_keeper> project
- Run the server in development mode: `npm run start:dev`
- Build the project for production: `npm run build`.
- Run the production build: `npm start`.
- Run production build with a different env file npm start -- --env="name of env file"

