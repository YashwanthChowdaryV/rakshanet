const axios = require("axios");

const HF_API =
    "https://api-inference.huggingface.co/models/unitary/toxic-bert";

const analyzeToxicity = async (text) => {
    try {
        const res = await axios.post(
            HF_API,
            { inputs: text },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HF_KEY}`,
                },
            }
        );

        if (!Array.isArray(res.data)) return null;

        return res.data;

    } catch (err) {
        console.log("HF error:", err.message);
        return null;
    }
};

module.exports = { analyzeToxicity };