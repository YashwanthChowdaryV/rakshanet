// backend/src/services/nlpEngine.js

const categories = {
    Threat: {
        weight: 40,
        patterns: [
            "kill you",
            "destroy you",
            "ruin your life",
            "beat you",
            "acid attack",
            "murder",
            "i will find you",
        ],
    },

    Blackmail: {
        weight: 30,
        patterns: [
            "send money",
            "pay me",
            "transfer money",
            "or i will leak",
            "i will expose",
            "i will upload",
            "bitcoin payment",
        ],
    },

    Sextortion: {
        weight: 35,
        patterns: [
            "private photos",
            "nudes",
            "video leak",
            "intimate video",
            "explicit images",
        ],
    },

    Harassment: {
        weight: 15,
        patterns: [
            "idiot",
            "loser",
            "worthless",
            "stupid",
            "ugly",
            "shame on you",
        ],
    },

    HateSpeech: {
        weight: 25,
        patterns: [
            "caste slur",
            "religion abuse",
            "go back to",
            "racial slur",
        ],
    },
};

// Hindi + Telugu support (basic)
const multilingualPatterns = [
    "maar dunga",     // Hindi threat
    "paise bhejo",    // Hindi blackmail
    "champesta",      // Telugu threat
];

const cleanText = (text) => {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/gi, " ")
        .replace(/\s+/g, " ");
};

const analyzeText = (inputText) => {
    const text = cleanText(inputText);
    let detectedCategories = [];
    let matchedKeywords = [];
    let severityScore = 0;

    Object.keys(categories).forEach((category) => {
        categories[category].patterns.forEach((pattern) => {
            if (text.includes(pattern)) {
                if (!detectedCategories.includes(category)) {
                    detectedCategories.push(category);
                    severityScore += categories[category].weight;
                }
                matchedKeywords.push(pattern);
            }
        });
    });

    // Multilingual detection
    multilingualPatterns.forEach((pattern) => {
        if (text.includes(pattern)) {
            severityScore += 25;
            detectedCategories.push("Threat");
            matchedKeywords.push(pattern);
        }
    });

    // Normalize severity
    if (severityScore > 100) severityScore = 100;

    let severityLabel = "Low";

    if (severityScore >= 70) severityLabel = "Critical";
    else if (severityScore >= 40) severityLabel = "High";
    else if (severityScore >= 20) severityLabel = "Medium";

    const confidence =
        detectedCategories.length > 0
            ? Math.min(0.95, 0.5 + detectedCategories.length * 0.15)
            : 0.30;

    const summary =
        detectedCategories.length > 0
            ? `Detected ${detectedCategories.join(
                ", "
            )} patterns. Severity classified as ${severityLabel}.`
            : "No strong harmful patterns detected.";

    return {
        detectedCategories,
        matchedKeywords,
        severityScore,
        severityLabel,
        confidence,
        summary,
    };
};

module.exports = { analyzeText };