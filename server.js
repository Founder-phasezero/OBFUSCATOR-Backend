import express from "express";
import { execSync } from "child_process";
import fs from "fs";

const app = express();

// 🔥 REQUIRED FOR EXTERNAL FRONTEND (GitHub Pages)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json({ limit: "200kb" }));

app.post("/obfuscate", (req, res) => {
  try {
    if (!req.body.code) {
      return res.status(400).send("No code");
    }

    fs.writeFileSync("input.lua", req.body.code);

    execSync(
      "lua Prometheus/cli.lua --preset Strong input.lua",
      { timeout: 5000 }
    );

    const result = fs.readFileSync("input.lua", "utf8");
    fs.unlinkSync("input.lua");

    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

app.listen(process.env.PORT || 3000);
