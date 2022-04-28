const fetch = require('node-fetch')

const handler = async function () {
  try {
    // const response = await fetch('http://localhost:8080/v1/authenticate', {
    const response = await fetch('https://polar-brook-70189.herokuapp.com/v1/authenticate', {
    // const response = await fetch('https://animated-froyo-aa2c68.netlify.app/v1/authenticate', {
      headers: { Accept: 'application/json' },
    })
    if (!response.ok) {
      // NOT res.status >= 200 && res.status < 300
      console.info("this didn't work")
      return { statusCode: response.status, body: response.statusText }
    }
    const data = await response.json()

    return {
      statusCode: 200,
      body: JSON.stringify({ msg: "success" }),
    }
  } catch (error) {
    // output to netlify function log
    console.log(error)
    return {
      statusCode: 500,
      // Could be a custom message or object i.e. JSON.stringify(err)
      body: JSON.stringify({ msg: error.message }),
    }
  }
}

module.exports = { handler }
