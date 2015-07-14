# A Live Web Chat-App Using Node.js

## Web Chat-App with a facebook user Login

### Dependencies Used

* Express
* CookieParser
* ConnectMongo
* Mongoose
* Passport

#### Objectives of the project

* User Signin with Facebook to Start a Live Chatroom
* Create a Live Chatroom Subject
* Chat with other users on the website in a private user created chatroom in real time. 
* Chatroom conversations are deleted once a user leaves room.
* Create as many different live chatroom subjects to spark different converstaions.

#### Setup Instructions

* Steps to add your database info to the config/development.json and config/production.json
* npm install - will add all your dependencies to your package.json
* Add/Create your MongoDB URL or whatever database you use, make sure you get its url to connect to it.
* Make a sessionSecret Key (can be any sessionSecret password you create)
* Get your appID from your developers.facebook acct
* Also will need your developers.facebook appSecret key
* Create your callbackURL inside of your dev.facebook acct.
