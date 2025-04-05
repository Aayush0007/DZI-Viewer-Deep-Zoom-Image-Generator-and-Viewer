const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const otpRoutes = require("./routes/otpRoutes");

require("dotenv").config();

const app = express();
app.use(cors());

app.use(bodyParser.json());

// Use OTP routes
app.use("/api", otpRoutes);

app.use("/images", express.static(path.join(__dirname, "public/images")));

app.get("/", (req, res) => {
  res.send("Welcome to the DZI Daemon Server!");
});

app.get("/folder-content", async (req, res) => {
  const imagesDir = path.resolve(
    __dirname,
    process.env.DZI_DIR || "public/images/Images"
  );

  if (!fs.existsSync(imagesDir)) {
    console.log("Resolved images directory path:", imagesDir);
    console.error("Images directory does not exist:", imagesDir);
    return res.status(500).json({ error: "Images directory not found" });
  }

  const folderContent = [];

  try {
    const subfolders = fs
      .readdirSync(imagesDir)
      .filter((file) => fs.statSync(path.join(imagesDir, file)).isDirectory());

    for (const folder of subfolders) {
      const folderPath = path.join(imagesDir, folder);
      const dziFiles = fs
        .readdirSync(folderPath)
        .filter((file) => file.endsWith(".dzi"));

      for (const file of dziFiles) {
        const fileNameWithoutExtension = file.split(".").slice(0, -1).join(".");
        const thumbnailPath = path.join(folderPath, "thumbnail.jpg");
        const thumbnailExists = fs.existsSync(thumbnailPath);

        folderContent.push({
          dzi: `/images/Images/${folder}/${file}`,
          thumbnail: thumbnailExists
            ? `/images/Images/${folder}/thumbnail.jpg`
            : null,
          name: fileNameWithoutExtension,
        });
      }
    }

    res.json({ Images: folderContent });
  } catch (err) {
    console.error("Error fetching folder content:", err);
    res.status(500).json({ error: "Failed to fetch folder content" });
  }
});

// Then serve static files or a fallback:
app.use(express.static(path.join(__dirname, "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(3001, "0.0.0.0", () =>
  console.log("Server running on port 3001")
);
