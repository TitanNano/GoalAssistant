# GoalAssistant
An intelligent productivity tool that unifies the abilities of Notes and Reminders into on application, so you are able to reach your goal.

## Prerequisites
Make sure the following tools are installed:

- Apache Cordova
- Gulp CLI
- Mongo DB
- Node.JS
- NPM
- Nginx or Apache to serve the client on the web


## Installation
Clone the repo
```
git clone https://github.com/TitanNano/GoalAssistant.git
```
Then move into the project folder and  install all dependencies
```
cd GoalAssistant
npm i
bower i
```

## Build and run
1. To create a build for the web run `gulp` (default task)
2. To create an android build
```
cd platforms/cordova
cordova platform add android
gulp platform:android
```
3. To install / run your latests android build
```
gulp run:android
```
4. To build android and directly run it
```
gulp platform:android:run
```

## Run Server

```
cd server/
npm i
node .
```

A `config.json` in `server/config/`, the file should contain the folowing key-value pairs:
```JSON
{
    "db_domain": "mongodb://local-user:local-user@127.0.0.1:27017/goal_assistant"
}
```

## Dependencies
See `package.json`
