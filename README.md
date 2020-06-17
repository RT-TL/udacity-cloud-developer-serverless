# Capstone Project Video Platform
This project is the Udacity Serverless Capstone Project. It showcases a serverless deployed app with Lambda functions that enables users to signup, in order to upload videos along with meta data. They can create, read, update and delete their own vidoes as well as sharing them publicly. A publicly shared video will be accessible to everybody given the link.

# Features
* create new videos and upload files
* edit uploaded videos
* publish and unpublish videos
* view published videos of other users
* log api events in log groups
* serverside request validation through reqvalidator-plugin

## Client

The client is located in the subfolder /client and can be started with

```bash
yarn install
yarn start
```

In order to run the client the references in the client root folder at `config.ts` need to be updated. This includes using valid `Auth0` variables.

## Backend

The backend is located in the subfolder /backend. It needs to be deployed to amazon or started by using serverless-offline.

Install to amazon:

```bash
sls deploy -v
```

Run locally:
```bash
sls offline start
```

## API

The provided API has the following endpoints:

```
GET /videos/:videoId
GET /videos/
GET /publicVideos
POST /videos
PATCH /videos/:videoId
DELETE /videos/:videoId
PATCH /videos/:videoId/publish
PATCH /videos/:videoId/unpublish
```