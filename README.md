# Dolby.io Media Music Mastering React App

The Music Mastering application in this repository demonstrates the capabilities of Dolby.io's Music Mastering solution for browser applications, built using React.

This repository will demonstrate how to develop the core Dolby.io Music Mastering API features and provide an understanding of how a Music Mastering workflow can look like within a web application. You can download the repository and run the application locally. If you are interested in more details about Dolby.io's Music Mastering capabilities, more information can be found here: https://dolby.io/products/music-mastering/.

What can I do with the Music Mastering app?

- Upload a track.
- Upload cover art and music metadata.
- Select a 30-second segment used for the mastering preview.
- Choose up to 5 music mastering presets and select the target loudness value.
- Create and listen to the 30-second mastered preview segments.
- Select your preferred music mastering configuration, and then create a final mastered track.

# Getting started

The steps below will quickly get you started using the Music Mastering application.

## Requirements & supported platforms

The Music Mastering app supports the following browsers:

- Chrome 100+
- Safari 15+
- Firefox 100+
- Edge 100+

## How to get a Dolby.io account

The Music Mastering API requires you to create a Dolby.io account. To set it up, go to https://dashboard.dolby.io/signnup and complete the form. After confirming your email address, you will be logged in.

## Dolby.io dashboard

After you log in to your Dolby.io account, you get access to the full dashboard where you can manage your account. From this page https://dashboard.dolby.io/dashboard/applications/summary you can manage your profile and billing.

## How to obtain your authentication credentials

Before you run the Music Mastering application, you need to go to the Dolby.io developer dashboard and add a new app to get your App key and App secret. You will add these credentials as environment variables in the _How to run the Music Mastering app_ procedure.

Create your App key and App secret:

1. Log in to the Dolby.io developer dashboard: https://dashboard.dolby.io/.
2. Click **ADD NEW APP**.
3. In the **Application Name** box, enter your application name.
4. In the **API Keys** column, in the same row as your application, click **Get API keys**.
5. Click **Copy** to copy your App key and App secret.

# How to run the Music Mastering app

Below is a list of steps that show you how to run the app locally. In addition to the Music Mastering app, this repository contains a local authentication server that works with the Music Mastering app to make secure calls to the Music Mastering API. This authentication server is for demo purposes only. 

**NOTE**: The mastering presets on the _Choose your presets_ page are meant as guidance for how you can customize your music mastering preset names. Please create preset names that are appropriate for your platform.

## Clone the repository

Use Git to clone the repository with `git@github.com:dolbyio-samples/media-app-react-music-mastering.git` or download and unzip the repository using the green button on the top of this page.

## Add your App key and App secret to the environment variables file

1. Copy the `apps/mm-server/.env.local.example` file and rename it: `apps/mm-server/.env.local`.
2. In the `apps/mm-server/.env.local` file, replace the corresponding values with the App key and App secret.

## Install dependencies

Open the main directory with the terminal.

Install dependencies with this command:

```
yarn
```


## Build the packages

```
yarn build:all
```

## Start the Music Mastering authentication server and app

Run the following commands:

```
yarn start:mm-server
yarn start:mm-sample
```

When the commands are complete, the local host app URL is displayed. Copy and paste the URL into your browser to view the Music Mastering app.   
