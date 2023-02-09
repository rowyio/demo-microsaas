# Background Removal App

This project allows users to remove the background from their photos using AI.

[![Remove Background App](./public/screenshot.png)](https://rodgetech.com/)

## How it works

Background removal is made possible by using the [modnet](https://github.com/pollinations/modnet) approach via [Replicate](https://replicate.com/). This project allows users to upload a photo which will first be stored in S3, forwarded to a Next.js API handler, and lastly utilize the Replicate API to return the photo with its background removed. All data such as user profile and credit packs are stored in Firestore, while the associated stripe payment webhook and cloud functions are managed in [Rowy](https://rowy.io/).

## Running locally

### Install dependencies:

```bash
npm install
```

### Run the dev server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
