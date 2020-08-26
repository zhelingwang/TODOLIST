# TODOLIST

todolist demo with Webpack+Vue+iView(ViewUI/view-design)+Vuex+serviceWorker+Web Push+indexedDB

## features

- add item
- remove item
- change item state of completion
- filter item
  - all
  - active (uncompleted)
  - completed
- clear all completed item

## how to work

- run server : `npm run server`

- to production
  - open `new CleanWebpackPlugin()` in webpack.config.js
  - run `npm run pro`to build
  - copy imgs , manifest.json and offline.html from src to dist folder
- development
  - copy imgs , manifest.json and offline.html from src to dist folder
  - run `npm run dev`
  - close `new CleanWebpackPlugin()` in webpack.config.js

