# MeanCourse

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.23.

## Installation
1. Install dependencies by running `npm install` in the project directory
2. Copy the nginx config file ([keytrader](keytrader)) to `/etc/nginx/sites-available/`
3. Enable it `sudo ln -s /etc/nginx/sites-available/keytrader /etc/nginx/sites-enabled/keytrader`
    * Ignore `ln: failed to create symbolic link '/etc/nginx/sites-enabled/keytrader': File exists` if it occurs, the file is already linked, but still need to restart nginx in next step
4. Restart nginx `sudo service nginx restart`

## Development Frontend server

Run `ng serve` for a dev server. Navigate to the remote's ip address. The app will automatically reload if you change any of the source files.

## Development Backend server
Run `npm run start:server`. The app will automatically reload if you change any of the source files.