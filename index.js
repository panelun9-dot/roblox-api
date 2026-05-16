const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Roblox funcionando");
});

app.get("/avatar/:username", async (req, res) => {
  try {
    const username = req.params.username;

    const userResponse = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        usernames: [username],
        excludeBannedUsers: false
      })
    });

    const userData = await userResponse.json();

    if (!userData.data || userData.data.length === 0) {
      return res.status(404).json({
        error: "Usuario no encontrado"
      });
    }

    const userId = userData.data[0].id;

    const avatarResponse = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png&isCircular=false`
    );

    const avatarData = await avatarResponse.json();

    res.json({
      username,
      userId,
      avatar: avatarData.data[0].imageUrl
    });

  } catch (error) {
    res.status(500).json({
      error: "Error cargando avatar"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});