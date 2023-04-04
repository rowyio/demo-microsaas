# Background Removal App - AI MicroSaaS Template

This project allows users to remove the background from their photos using AI and comes integrated with Stripe payment. You can clone this project to create a AI MicroSaaS project and easily modify it for any usecase.

[![Remove Background App](./public/screenshot.png)](https://demo-microsaas.vercel.app/)

## Stack used

**Database**: Firebase  
**CMS**: Rowy  
**Auth**: Firebase Auth  
**Payment**: Stripe  
**CSS**: Tailwind  
**Usecase**: Subscription, SaaS, AI, MicroSaaS

## How it works

This app uses the [modnet](https://github.com/pollinations/modnet) API via [Replicate](https://replicate.com/) to removed background of images. Once users upload images, these images first gets stored to Firebase storage and then using low-code Cloud Functions built with [Rowy](https://www.rowy.io/blog), the image's background is removed by making API call to Replicate which returns the photo with its background removed. Without accound creation, user can get only 10 credits and for logged in users, they can unlock 100 credits along with ability to track paid users. User authentication is managed via Firebase Auth and managed easily on User management table of Rowy. All data such as user profile, generated images, and credit packges are stored in Firestore, while the associated stripe payment webhook and cloud functions are all managed in [Rowy](https://rowy.io/).

## Get started quickly using easy deploy template 

### Frontend Template
1. Clone and deploy the Next.js App using Vercel's one click deploy link
2. Add the .env variables as shown in the .env.local.example file 

### Backend Template
Clone backend Table on Rowy that comes bundled with data CMS for user management via Firebase Auth, Cloud Functions for Replicate API along with webhooks Stripe credits and payments.  

### Creating a account on Replicate to get API key.

1. Visit [Replicate](https://replicate.com/) to create an account.
2. Click on [Account](https://replicate.com/account) in the menu. And, here you can find your API token, copy it.

### Creating a stripe account.

1. Go to [Stripe](https://stripe.com/) to create an account.
2. Once you're signed in, ensure test mode is on and the go to the [API keys section](https://dashboard.stripe.com/test/apikeys) to get youre api key.

### Creating a Rowy account.
Add steps here.


## Running locally

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

## One-Click Deploy

Deploy this project using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rowyio/demo-microsaas&env=REPLICATE_API_TOKEN,STRIPE_SECRET_KEY,FIREBASE_PROJECT_ID,FIREBASE_CLIENT_EMAIL,FIREBASE_PRIVATE_KEY,NEXT_PUBLIC_FIREBASE_API_KEY,NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,NEXT_PUBLIC_FIREBASE_SENDER_ID,NEXT_PUBLIC_FIREBASE_APP_ID,NEXT_PUBLIC_FIREBASE_PROJECT_ID,NEXT_PUBLIC_ROWY_START_PREDICTION_WEBHOOK,NEXT_PUBLIC_ROWY_CREATE_STRIPE_CHECKOUT_WEBHOOK&project-name=demo-microsaas&repo-name=demo-microsaas)