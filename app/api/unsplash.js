const { createApi } = require("unsplash-js")
const fetch = require("node-fetch")

const unsplash = new createApi({
	accessKey: 'MBjITdqQuKNreAK_0nc5v42nsIsfayUR5rWA4Wa-xPw',
    fetch: fetch,
})

module.exports = unsplash;