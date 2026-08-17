<img src="assets/images/full_icon.png" alt="Outdoorer Icon" width="400" height="300">

# Outdoorer

**Outdoorer is an iOS mobile app for providing weather recommendations for outdoor activities based on weather forecasts.**

## Features

- activity-specific weather suitability scoring
- safety override rules
- user weather preference filters
- map-based location selection
- social features (friends and activity sharing)

## Tech Stack

- Expo and React Native
- TypeScript
- Expo Router
- Supabase
- TanStack Query
- Apple Maps APIs
- Jest and ts-jest for unit tests

## Project Structure

- app: Expo Router screens
- components: reusable UI and feature-level components
- features: domain logic (activity, weather, scoring, map, profile, friends)
- providers: app providers (query, location)
- lib: shared clients (for example Supabase client)
- supabase/functions: serverless functions
- tests: shared test fixtures and generated reports
- assets: diagrams, documentation, media

## Prerequisites

- Node.js 18+
- npm 9+
- Xcode for iOS simulator and device builds
- Android Studio for Android emulator (optional)
- Expo CLI (via npx is fine)
- A Supabase project

## Environment Variables

Create a local environment file (for example .env) with the following keys:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_google_web_client_id
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your_google_ios_client_id
```

Notes:

- Supabase values are required by lib/supabase.ts.
- Google values are required for Google Sign-In in app/(start)/signin.tsx.

## Install and Run

Install dependencies:

```bash
npm install
```

For local iOS development builds (recommended workflow):

```bash
npx expo run:ios
```

Expo development build guide:

- https://docs.expo.dev/develop/development-builds/introduction/

## Scripts

- npm run test: run all Jest tests
- npm run test:watch: watch mode
- npm run test:core: focused core logic suites
- npm run test:coverage: core suites plus coverage output
- npm run test:report: core suites plus JSON report at tests/reports/core-tests.json

## Testing

Jest is configured in jest.config.js with:

- ts-jest preset
- Node test environment
- test matching under **tests**
- coverage output in tests/reports/coverage

Core scoring tests currently target:

- safety overrides
- base score behavior
- preference penalties
- recommended window selection

## Branching and Releases

- `main` is protected: no direct pushes, changes land via pull request.
- Every change, feature or fix, gets its own short-lived branch off `main`.
- Every PR into `main` runs lint and the Jest suite (`.github/workflows/ci.yml`)
  as a required status check.
- To ship a TestFlight release, run (from an `eas login`-authenticated shell):

  ```bash
  eas workflow:run .eas/workflows/release.yml --input version=1.2.0
  ```

  This runs on Expo's infrastructure (not GitHub Actions): it builds the iOS
  `production` profile with the given version, then submits the result to
  TestFlight. The build number is managed automatically by EAS
  (`autoIncrement: true` in `eas.json`) — only the marketing version (the
  `version` input) needs to be chosen deliberately.
- Version bump convention: patch for bug fixes, minor for new
  features/enhancements, major for a fundamental scope change.

## Backend Integration

Supabase Edge Functions used by the app:

- get-weather-24h
- get-apple-maps-token

The client invokes weather via features/weather/hooks/useWeather.ts and invokes map token issuance through the corresponding maps feature hooks.

## Troubleshooting

If TypeScript cannot find Jest globals like describe or expect:

- ensure @types/jest is installed
- ensure tsconfig.json includes jest in compilerOptions.types

If weather requests fail:

- verify EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY
- verify the get-weather-24h edge function is deployed and reachable

If Google Sign-In fails:

- verify EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID and EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID
- verify Google OAuth config in Supabase and platform credentials

If map search fails:

- verify get-apple-maps-token function setup
- verify Apple Maps credentials on server function side

## User Guide

For end-user usage instructions, see MANUAL.md.

## License

This project is licensed under the Apache License 2.0. See LICENSE for details.