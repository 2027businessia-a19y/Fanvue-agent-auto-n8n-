import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const BYTEPLUS_API_KEY = process.env.BYTEPLUS_API_KEY;
const BYTEPLUS_ENDPOINT = "https://api.byteplusapi.com/api/paas/image/seedream3"; 

// Reformulation simple + English translation
async function sanitizePrompt(prompt) {
  return `High quality 16:9 photography of ${prompt}, realistic, detailed, natural lighting`;
}

app.post("/generate", async (req, res) => {
  try {
    const userPrompt = req.body.userPrompt;
    const finalPrompt = await sanitizePrompt(userPrompt);

    const payload = {
      model: "lightning",
      prompt: finalPrompt,
      aspect_ratio: "16:9",
      num_images: 1
    };

    const response = await axios.post(BYTEPLUS_ENDPOINT, payload, {
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": BYTEPLUS_API_KEY
      }
    });

    const imgUrl = response.data?.data?.image_urls?.[0];

    if (!imgUrl) {
      return res.status(400).json({
        status: "error",
        message: "BytePlus n'a pas renvoyé d'image."
      });
    }

    res.json({
      status: "success",
      imageUrl: imgUrl
    });

  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
});

app.listen(3000, () => {
  console.log("Service Render opérationnel sur port 3000.");
});
