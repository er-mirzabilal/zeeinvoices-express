const { OAuth2Client } = require("google-auth-library");

const googleAuthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyToken(token) {
  try {
    const ticket = await googleAuthClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}

module.exports = { googleAuthClient, verifyToken };
