<p align="center"> 
  <h3 align="center"> TimeTableScheduler - Frontend </h3> 
  <p align="center"> A platform where students can experiment with the possible combination of schedule options they can pick at the start of the semester  </p> 
  <p align="center"> 
    <a href="https://reactjs.org/"> 
      <img src="https://img.shields.io/badge/react-v18.2-inactive&?style=for-the-badge&logo=react" alt="frontend-dev-react">
    </a> 
    <a href="https://nodejs.com/"> 
      <img src="https://img.shields.io/badge/nodejs-v21-red&?style=for-the-badge&logo=node.js" alt="nodejs"> 
    </a> 
    <a href="https://tailwindcss.com"> 
      <img src="https://img.shields.io/badge/tailwindcss-v3.4.1-red&?style=for-the-badge&logo=tailwindcss" alt="tailwindcss"> 
    </a>
    <a href="https://vitejs.dev"> 
      <img src="https://img.shields.io/badge/vite-v4.3.1-red&?style=for-the-badge&logo=vite" alt="vite"> 
    </a>
    <a href="https://ui.shadcn.com/"> 
      <img src="https://img.shields.io/badge/shadcn/ui--red&?style=for-the-badge&logo=shadcnui" alt="vite"> 
    </a>
  </p>
</p>

A platform to students build their schedules.  
Made with :heart: by NIAEFEUP.

# Installation

In order to run this project, you need to have [Docker](https://www.docker.com/).

# Brief explanation of used vite commands

## `npm run dev`

This is the command that should be used if you do not want to use docker and want to run a development server.

Before running this you should have previously ran `npm install`.

## `npm run build`

It builds the react application by generating static files that would be a lot like what a website would look like if no frameworks were used.

It greatly minifies the files and reduces the number of them, making a way better experience for the user.

Before running this you should have previously ran `npm install`.

## `npm run preview`

This allows us to preview what the production build will look like but `Vite` does not recommend at all using this in the production image at all.

# Running the project

## Docker

This is the recommended approach since it uniformizes the way the application behaves since the developers do not have the same computer hardware nor the same operating system.

### Development

Firstly, you have to create an `.env` file in order for the app to receive environment variables.

```bash
cp .env.example .env
```

Then, to build the application run:

```bash
docker-compose build tts-frontend
```

After build, run to execute:

```bash
./dev.sh
```

If the script is not able to be executed you may have to change its permissions in order for you to have execution permission (`x`).

```bash
chmod u+x ./dev.sh
```

To stop the container:

```bash
docker-compose down
```

After executing the application, open your browser at: `localhost:3100`

### Production

In order to run the production build, we need to use the `tts-frontend-prod` container instead of the `tts-frontend` one.

In the production build we are serving a static page with minified html, css and javascript files, greatly reducing the load of the page.

Firstly, you have to create an `.env` file in order for the app to receive environment variables.

```bash
cp .env.example .env
```

Internally, when the production build runs with vite, it creates an `.env.production` file from the `.env` file to be used by the `vite build` command. This was done to ease the development process, since running `./dev.sh` complained that the `.env.production` was not found.

To build the application run:

```bash
docker-compose build tts-frontend-prod
```

After build, run to execute:

```bash
./prod.sh
```

If the script is not able to be executed you may have to change its permissions in order for you to have execution permission (`x`).

```bash
chmod u+x ./prod.sh
```

To stop the container:

```bash
docker-compose down
```
## Baremetal with `npm`


```bash
npm install
npm run dev
```

In case you have problems with this commands you may run

```bash
rm -rf node_modules
rm package-lock.json
```

And then try the previous commands (`npm install` and `npm run dev` again).

In case you want to preview the production build you can run

```bash
npm run preview
```