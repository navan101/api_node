
module.exports = {
  secret: "supersecret",
  database: "mongodb://admin:admin123@ds139278.mlab.com:39278/nav_db",
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: process.env.LOG_FORMAT || 'combined',
    fileLogger: {
      directoryPath: process.env.LOG_DIR_PATH || process.cwd(),
      fileName: process.env.LOG_FILE || 'app.log',
      maxsize: 10485760,
      maxFiles: 2,
      json: false
    }
  },
  // log: {
  //   // logging with Morgan - https://github.com/expressjs/morgan
  //   // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
  //   format: 'dev',
  //   fileLogger: {
  //     directoryPath: process.cwd(),
  //     fileName: 'app.log',
  //     maxsize: 10485760,
  //     maxFiles: 2,
  //     json: false
  //   }
  // },
};
