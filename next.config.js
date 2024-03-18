/** @type {import('next').NextConfig} */

const path = require('path');

const nextConfig = {
    sassOptions: {
		includePaths: [path.join(__dirname, "styles")],
		prependData: `
			@import "_variables.scss";
		`
	}
};

module.exports = nextConfig;
