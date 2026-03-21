// backend/src/services/nlpEngine.js

const dictionaries = {
    english: {
        threat: ["kill you", "destroy you", "ruin your life", "beat you", "acid attack", "murder", "i will find you", "bomb", "shoot", "stab"],
        abusive: ["idiot", "loser", "worthless", "stupid", "ugly", "bitch", "slut", "whore", "bastard", "asshole", "fuck", "motherfucker"]
    },
    hindi: {
        threat: ["maar dunga", "jaan se maar", "khatam kar dunga", "kaat dunga", "goli maar"],
        abusive: ["kutte", "kamina", "chutiya", "bhadwa", "madarchod", "behenchod", "raand", "saale"]
    },
    telugu: {
        threat: ["champesta", "narikestha", "patestha", "kallu viragkodtha"],
        abusive: ["lanja", "na kodaka", "nee yavva", "pooku", "mundamopi", "vedhava"]
    },
    tamil: {
        threat: ["kolven", "vettuven", "kuthiduven", "saavadipen"],
        abusive: ["thevidiya", "punda", "sunni", "mayire", "koothiyan"]
    },
    kannada: {
        threat: ["sayisuthene", "kadidu bidthini", "hodedakthini"],
        abusive: ["sule maga", "boli maga", "halka", "kothi", "bewarsi"]
    },
    malayalam: {
        threat: ["kollum", "thallikollum", "vettikollum"],
        abusive: ["thayoli", "myre", "poori", "kazhuveri", "pundachi"]
    },
    bengali: {
        threat: ["mere felbo", "khun korbo", "kete felbo"],
        abusive: ["khanki", "bokachoda", "bal", "shuorer bachha", "magi", "bara"]
    },
    marathi: {
        threat: ["marun takel", "kapun takel", "jivan marun takel"],
        abusive: ["bhadya", "chutiya", "zhavadya", "randichya", "aizhavadya"]
    },
    punjabi: {
        threat: ["maar daanga", "jaan ton maar", "goli maar"],
        abusive: ["bund", "penchod", "kanjar", "kutiya", "lun"]
    },
    gujarati: {
        threat: ["mari nakhish", "jaan thi mari nakhish", "kapi nakhish"],
        abusive: ["gando", "chodu", "bhosdina", "raand", "gandio"]
    }
};

const cleanText = (text) => {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/gi, " ")
        .replace(/\s+/g, " ");
};

const detectLanguageAndAnalyze = (text) => {
    const cleanedText = cleanText(text);
    
    let detectedCategories = [];
    let matchedThreats = [];
    let matchedAbusive = [];
    let langScores = {};
    let severityScore = 0;

    Object.keys(dictionaries).forEach((lang) => {
        langScores[lang] = 0;
        
        dictionaries[lang].threat.forEach((pattern) => {
            if (cleanedText.includes(pattern)) {
                matchedThreats.push(pattern);
                langScores[lang] += 1;
                if (!detectedCategories.includes("Threat")) detectedCategories.push("Threat");
                severityScore += 40;
            }
        });

        dictionaries[lang].abusive.forEach((pattern) => {
            if (cleanedText.includes(pattern)) {
                matchedAbusive.push(pattern);
                langScores[lang] += 1;
                if (!detectedCategories.includes("Abusive/Harassment")) detectedCategories.push("Abusive/Harassment");
                severityScore += 15;
            }
        });
    });

    // Determine primary language based on highest match
    let detectedLanguage = "English"; // default
    let maxScore = 0;
    Object.keys(langScores).forEach(lang => {
        if (langScores[lang] > maxScore) {
            maxScore = langScores[lang];
            detectedLanguage = lang.charAt(0).toUpperCase() + lang.slice(1);
        }
    });

    // Normalize severity
    if (severityScore > 100) severityScore = 100;

    let severityLabel = "Low";
    if (severityScore >= 70) severityLabel = "Critical";
    else if (severityScore >= 40) severityLabel = "High";
    else if (severityScore >= 20) severityLabel = "Medium";

    const summary = (matchedThreats.length > 0 || matchedAbusive.length > 0)
        ? `Detected ${detectedCategories.join(", ")}. Severity is ${severityLabel}.`
        : "No strong harmful patterns detected.";

    return {
        detectedLanguage,
        detectedCategories,
        matchedThreats,
        matchedAbusive,
        severityScore,
        severityLabel,
        summary,
        allMatchedKeywords: [...matchedThreats, ...matchedAbusive]
    };
};

module.exports = { analyzeText: detectLanguageAndAnalyze };