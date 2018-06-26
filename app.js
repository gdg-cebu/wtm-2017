const path = require('path');
const fs = require('fs-promise');
const express = require('express');
const consolidate = require('consolidate');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const config = require('./config');


const app = express();

app.engine('html', consolidate.nunjucks);
app.set('views', path.join(__dirname, 'views'));

app.use(morgan('dev'));
app.use(favicon(path.join(__dirname, 'static', 'images', 'favicon.ico')));

app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/sw.js', express.static(path.join(__dirname, 'static', 'javascripts', 'sw.js')));
app.use('/offline-google-analytics',  express.static(path.join(
  __dirname, 'node_modules', 'sw-offline-google-analytics', 'build')));

app.use((req, res, next) => {
  res.locals.secrets = {
    GOOGLE_ANALYTICS_TRACKING_ID: config.analytics.GOOGLE_ANALYTICS_TRACKING_ID
  };
  res.locals.analytics = req.hostname !== 'localhost';
  next();
});

app.get('/', (req, res) => {
  Promise.all([
    read(__dirname, 'data', 'speakers.json'),
    read(__dirname, 'data', 'sessions.json'),
    read(__dirname, 'data', 'sponsors.json')
  ]).then(data => {
    const context = {
      map: mapUrl(),
      speakers: data[0].sort(_ => Math.random() - 0.5),
      sessions: data[1],
      sponsors: data[2]
    };
    res.render('pages/index.html', context);
  });
});


app.get('/coc', (req, res) => {
  res.render('pages/coc.html', context);
});


function mapUrl() {
  const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap';
  const latitude = config.map.VENUE_LATITUDE;
  const longitude = config.map.VENUE_LONGITUDE;
  const query = config.map.GOOGLE_MAPS_CONFIG;
  query['markers'] = `color:red|${latitude},${longitude}`;
  query['center'] = `${latitude},${longitude}`;
  query['key'] = config.map.GOOGLE_MAPS_API_KEY;

  const querystring = Object.keys(query).reduce((qs, key) => {
    qs.push(`${key}=${encodeURIComponent(query[key])}`);
    return qs;
  }, []).join('&');
  return `${baseUrl}?${querystring}`;
}


function read(...segments) {
  const filepath = path.join.apply(path, segments);
  return fs.readFile(filepath).then(body => JSON.parse(body));
}


module.exports = app;
