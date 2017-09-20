# PlayCanvasPlayGround

## Required Node Version
node = 7.6.0, npm = 4.1.2    
https://nodejs.org/download/release/v7.6.0/

## Build
under the project root path execute below commands

* build for your 1st time
```
npm run build-all
```

* build product version
```
npm run prod # will build and start a server
npm run prod -- build # will only build
npm run prod -- server # will only start a server
```

* run under development live-reload mode
```
npm run dev
```

* deploy dist/ folder to remote rayion remote ftp server
```
npm run deploy
```

* (download and/or) build play-canvas engine
```
npm run build-play-canvas
```
