module.exports = {
  apps : [{
    name   : "ScreenshotAPI",
    script : "./server.js",
    watch  : false,
    max_memory_restart: '500M', // Khởi động lại nếu quá 500MB RAM
    env: {
      NODE_ENV: "production",
    }
  }]
}
