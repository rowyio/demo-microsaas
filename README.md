# Background Removal App

This project allows users to remove the background from their photos using AI.

[![Remove Background App](./public/screenshot.png)](https://rodgetech.com/)

## How it works

Background removal is made possible by using the [modnet](https://github.com/pollinations/modnet) approach via [Replicate](https://replicate.com/). This project allows users to upload a photo which will first be stored in firebase storage, forwarded to a google cloud function managed in rowy, and lastly utilize the Replicate API to return the photo with its background removed. All data such as user profile, generated images, and credit packges are stored in Firestore, while the associated stripe payment webhook and cloud functions are all managed in [Rowy](https://rowy.io/).

## Running locally

### Creating a account on Replicate to get API key.

1. Visit [Replicate](https://replicate.com/) to create an account.
2. Click on [Account](https://replicate.com/account) in the menu. And, here you can find your API token, copy it.

### Creating a stripe account.

1. Go to [Stripe](https://stripe.com/) to create an account.
2. Once you're signed in, ensure test mode is on and the go to the [API keys section](https://dashboard.stripe.com/test/apikeys) to get youre api key.

### Storing API keys in .env

Create a `.env.local` file in the root of the project. And store your API key in it, as shown in the `.env.local.example` file.

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
