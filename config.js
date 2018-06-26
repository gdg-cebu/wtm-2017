require('dotenv').config();

module.exports = {
  app: {
    PORT: process.env.PORT || 3000
  },

  map: {
    VENUE_LATITUDE: '10.343541',
    VENUE_LONGITUDE: '123.921266',
    GOOGLE_MAPS_CONFIG: {
      maptype: 'roadmap',
      size: '1024x200',
      zoom: 16,
      scale: 2
    },
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY
  },

  analytics: {
    GOOGLE_ANALYTICS_TRACKING_ID: process.env.GOOGLE_ANALYTICS_TRACKING_ID
  }
};
