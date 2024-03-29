<h1 align="center" style="font-size: 3rem">
  Dotnet Zoo Admin
</h1>

## Description

Zoo Admin App with [ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/?view=aspnetcore-7.0)  Web API and [ReactJS](https://reactjs.org/) JavaScript library.

## Installation and setup

```bash
$ cd API
$ dotnet ef database update
```

## Running the App (Frontend & Backend)

```bash
# backend production mode
$ cd API
$ dotnet run --launch-profile "API-Production"

# frontend production mode
$ cd frontend && npm install
$ npm run vite-preview

And after visit http://localhost:5000/
```

## Running the Development (Frontend & Backend)

```bash

# backend development mode
$ dotnet run

# frontend development mode
$ cd frontend && npm install
$ npm vite-dev
And after visit http://localhost:4000/
