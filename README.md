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

## How to get a Dolby.io account

To use the Music Mastering API, you need to create a Dolby.io account. To set it up, go to https://dashboard.dolby.io/signnup and complete the form. After confirming your email address, you will be logged in.

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

Below is a list of steps that show you how to run the app locally. In addition to the Music Mastering app, this repository contains a local application server that works with the Music Mastering app to make secure calls to the Music Mastering API. 

**NOTE**: This application server is for demo purposes only. 



## Clone the repository

Use Git to clone the repository with `git@github.com:dolbyio-samples/media-app-react-music-mastering.git` or download and unzip the repository using the green button on the top of this page.

## Add your App key and App secret to the environment variables file

1. Copy the `apps/mm-server/.env.local.example` file and rename it: `apps/mm-server/.env.local`.
2. In the `apps/mm-server/.env.local` file, update the "replace" values to work with your environment.

## Create and install the Music Mastering application server certificate

To use the application server, you must install a certificate to set up the Secure Sockets Layer. 
Before you start, install the [mkcert](https://github.com/FiloSottile/mkcert) Command Line Interface.

1. Run the following commands using the local Certificate Authority:

```
cd apps/mm-server/src/certs
mkcert localhost
```

2. Install the certificate using the following command and return to the root directory before installing dependencies:

```
mkcert -install
cd ../../../..
```


## Install dependencies

Using the terminal, in the root directory, install dependencies with this [Yarn](https://yarnpkg.com/) command:

```
yarn
```


## Build the Music Mastering application package dependencies

The following command builds the application dependencies and also builds a distribution package. You can find the package in the `/dist` directory. 


```
yarn build:all
```

## Start the Music Mastering application server and app

You must start the application server and the Music Mastering app in separate terminal windows. 

Before you start the Music Mastering sample app, make sure no applications are using port 4200.  

1. Open a terminal window and run the following command:

```
yarn start:mm-server
```
2. Open a new terminal window and run the following command:
```
yarn start:mm-sample
```

When the commands are complete, the sample app URL http://localhost:4200 is displayed. Copy and paste the URL into your browser to view the Music Mastering app.

## Using the Music Mastering app

**NOTE**: The mastering presets on the _Choose your presets_ page are meant as guidance for how you can customize your music mastering preset names. Please create preset names that are appropriate for your platform. 

### Known issues and limitations

- .AIFF track upload is not supported.

### Requirements and supported platforms

The Music Mastering app supports the following browsers:

- Chrome 100+
- Safari 15+
- Firefox 100+
- Edge 100+



