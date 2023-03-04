module.exports = {
  apps : [{
    name: "myapp",
    script: "/var/www/askexo/app.js",
	env: {
        NODE_ENV: 'production',
        NODE_MODULES_PATH: '../../../home/korby/node_modules',
		API_KEY: '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'
      }
    // other options
  }]
}