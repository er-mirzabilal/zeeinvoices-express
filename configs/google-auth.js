const axios = require("axios");

async function verifyToken(token) {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v1/tokeninfo",
      {
        params: { access_token: token },
      }
    );

    if (response.data.error) {
      console.error("Error verifying token:", response.data.error);
      return null;
    }

    // Optionally, verify that the token is intended for your application
    if (response.data.audience !== process.env.GOOGLE_CLIENT_ID) {
      console.error("Token not intended for this application");
      return null;
    }

    return response.data;
  } catch (error) {
    console.error("Error verifying token:", error.message);
    return null;
  }
}

module.exports = { verifyToken };
