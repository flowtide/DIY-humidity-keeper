#DIY Humidity Management

## Table of contents

* [Deployment](#deployment)
* [Development Memo](#development)

## <a name="deployment"/>Deployment
* Build Vuejs App
```
cd humidity_keeper_app
npm install
npm run build
```

* Build Web Service
```
cd humidity_keeper
npm install
npm run build
```

* Test Web Service
```
cd humidity_keeper
npm start
```

* Register a web service as system deamon
```
npm install pm2 -g 
pm2 --name humidity-keeper start npm -- start
pm2 startup systemd
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u pi --hp /home/pi
pm2 save
```

* Access a web service with web browser

Open "http://<ip>:8000" URL.  
Default user name is "admin" with no password.

## <a name="development"/>Development Memo
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

* Test humidity report
```
curl "http://localhost:8000/api/v1/devices/notify?mac=58:2d:34:38:22:6f&temperature=46.0&humidity=39.9&battery=96"
```
