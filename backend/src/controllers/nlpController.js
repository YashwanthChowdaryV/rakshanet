const axios = require("axios");

const HF_TOKEN = process.env.HF_TOKEN;

const MODEL = "unitary/toxic-bert";

exports.analyzeMultipleTexts = async (req, res) => {
    try {

        const { texts } = req.body;

        const text = texts[0];
        const lower = text.toLowerCase();

        // ---------------- AI CALL ----------------

        let aiScore = 0;

        try {

            const response = await axios.post(
                `https://router.huggingface.co/hf-inference/models/${MODEL}`,
                { inputs: text },
                {
                    headers: {
                        Authorization: `Bearer ${HF_TOKEN}`,
                    },
                }
            );

            let result = response.data;

            if (Array.isArray(result)) result = result[0];
            if (Array.isArray(result)) result = result[0];

            aiScore = result.score
                ? result.score * 100
                : 0;

        } catch (e) {

            aiScore = 0;

        }


        // ---------------- KEYWORD DICTIONARY ----------------

        const threatList = [
            "kill",
            "murder",
            "bomb",
            "attack",
            "rape",
            "acid",
            "maar dunga",
            "champesta",
            "kolven",
            "kollum",
        ];

        const abuseList = [
            "fuck",
            "bitch",
            "slut",
            "idiot",
            "stupid",
            "madarchod",
            "lanja",
            "chutiya",
            "asshole",
        ];

        let threatWords = [];
        let abusiveWords = [];

        threatList.forEach(w => {
            if (lower.includes(w)) threatWords.push(w);
        });

        abuseList.forEach(w => {
            if (lower.includes(w)) abusiveWords.push(w);
        });


        // ---------------- DICTIONARY SCORE ----------------

        let dictScore = 0;

        dictScore += threatWords.length * 40;
        dictScore += abusiveWords.length * 25;

        if (dictScore > 100) dictScore = 100;


        // ---------------- FINAL SCORE ----------------

        let finalScore = Math.max(aiScore, dictScore);

        finalScore = Math.round(finalScore);


        // ---------------- SEVERITY ----------------

        let severity = "Low";

        if (finalScore > 80) severity = "Critical";
        else if (finalScore > 60) severity = "High";
        else if (finalScore > 30) severity = "Medium";


        // ---------------- LANGUAGE ----------------

        let language = "English";

        if (/[\u0900-\u097F]/.test(text)) language = "Hindi";
        if (/[\u0C00-\u0C7F]/.test(text)) language = "Telugu";
        if (/[\u0B80-\u0BFF]/.test(text)) language = "Tamil";


        // ---------------- RISK ----------------

        let riskLevel = "Safe";

        if (finalScore > 80 || threatWords.length > 0)
            riskLevel = "Danger";

        else if (finalScore > 60)
            riskLevel = "Warning";

        else if (finalScore > 30)
            riskLevel = "Suspicious";


        // ---------------- EVIDENCE ----------------

        let evidenceScore =
            finalScore +
            threatWords.length * 10 +
            abusiveWords.length * 5;

        if (evidenceScore > 100)
            evidenceScore = 100;


        // ---------------- CASE ----------------

        let caseSuggestion = "No action";

        if (riskLevel === "Danger")
            caseSuggestion = "File Police Complaint";

        else if (riskLevel === "Warning")
            caseSuggestion = "Save Evidence";

        else if (riskLevel === "Suspicious")
            caseSuggestion = "Monitor";


        res.json({
            results: [
                {
                    text,
                    severity,
                    severityScore: finalScore,
                    aiScore: Math.round(aiScore),
                    language,
                    threatWords,
                    abusiveWords,
                    riskLevel,
                    evidenceScore,
                    caseSuggestion,
                },
            ],
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "AI error",
        });

    }
};