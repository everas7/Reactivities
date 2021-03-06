# Overview

This is a social network like application, that allows users to create events and set a time and place for them. Users are able to browse through events and join those that they want to attend, as well as comment the events and follow other users.

[Based on the Udemy Course](https://www.udemy.com/course/complete-guide-to-building-an-app-with-net-core-and-react/)

# Stack
- Back-end: ASP.NET Core 3.0
- Front-end: ReactJs
- Database Manager: SQLite for Development and MySql for Production
- Cloud Storage: Cloudinary

# Anatomy

The project is composed by an API built on ASP.NET Core 3.0 and a client webapp built with ReactJs.

API Structure
- API
- Application
- Domain
- Infrastructure
- Persistance


WebApp Structure
- app
  - api
  - common
  - layout
  - models
  - stores
- features
  - activities
  - home
  - nav
  - profiles
  - user

# Setting Up Project
## Environment Variables

Add this configuration variables to appsettings.json with the right values for your cloudinary account and the token key of your choice.

For this you may need to create a free account at [Cloudinary](https://cloudinary.com) in case you don't have one, and get the cloudname, api secret and key of your specific account.

```
 "Cloudinary": {
    "CloudName": "thename",
    "APISecret": "thesecret",
    "APIKey": "thekey"
  },
  "TokenKey": "super secret key",
```

[Optional]
In order to configure facebook signin for the application add this configuration variables to appsettings.json as well using the right values in your case.

```
"Authentication": {
    "Facebook": {
      "AppId":"theappid",
      "AppSecret":"theappsecret"
    }
  },
```

# Installing Dependencies

API
```
dotnet restore
```
Web App
```
cd web-app
npm start
```

# Running Project

```
cd API
dotnet watch run
```

```
cd web-app
npm start
```

# Additional Notes
TODO
