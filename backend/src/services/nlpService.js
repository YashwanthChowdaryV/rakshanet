const { analyzeText } = require("./nlpEngine");
const { analyzeToxicity } = require("./toxicityModel");

const analyzeFullText = async (text) => {

    // rule engine
    const ruleResult = analyzeText(text);

    // AI model
    const aiResult = await analyzeToxicity(text);

    let aiScore = 0;

    if (aiResult && aiResult[0]) {
        aiScore = Math.round(aiResult[0].score * 100);
    }

    // combine scores
    let finalScore = ruleResult.severityScore + aiScore * 0.5;

    if (finalScore > 100) finalScore = 100;

    let finalLabel = "Low";

    if (finalScore >= 70) finalLabel = "Critical";
    else if (finalScore >= 40) finalLabel = "High";
    else if (finalScore >= 20) finalLabel = "Medium";

    return {
        ...ruleResult,
        aiScore,
        finalScore,
        finalLabel,
    };
};

module.exports = { analyzeFullText };