
exports.getAcademicSupport = (req, res) => {
    const resources = [
        {
            id: 1,
            title: "Academic Continuity Plan",
            category: "Policy",
            description: "Guidelines for maintaining academic progress during ongoing investigations or recovery periods.",
            link: "#",
            icon: "📚"
        },
        {
            id: 2,
            title: "Peer Mentorship Program",
            category: "Support",
            description: "Connect with senior students who can provide guidance and academic notes.",
            link: "#",
            icon: "👥"
        },
        {
            id: 3,
            title: "Exam Deferral Request",
            category: "Process",
            description: "Form and process for requesting exam rescheduling due to cyber-incident-related distress.",
            link: "#",
            icon: "📝"
        },
        {
            id: 4,
            title: "Digital Literacy Workshop",
            category: "Education",
            description: "Learn safe digital practices to protect your academic work and personal data.",
            link: "#",
            icon: "💻"
        }
    ];

    res.json(resources);
};

exports.getAwarenessResources = (req, res) => {
    const resources = [
        {
            id: 1,
            title: "Cyber Stalking Prevention Guide",
            type: "PDF Guide",
            duration: "10 min read",
            description: "Key steps to take if you suspect you are being followed or harassed online.",
            link: "#",
            tag: "High Priority"
        },
        {
            id: 2,
            title: "Social Media Privacy Checklist",
            type: "Interactive",
            duration: "5 min",
            description: "Step-by-step instructions for locking down your Instagram, Snapchat, and LinkedIn profiles.",
            link: "#",
            tag: "Essential"
        },
        {
            id: 3,
            title: "Understanding Digital Consent",
            type: "Video",
            duration: "3 min",
            description: "A short educational video explaining the legal and ethical boundaries of digital sharing.",
            link: "#",
            tag: "Educational"
        },
        {
            id: 4,
            title: "Reporting to Authorities",
            type: "Infographic",
            duration: "2 min read",
            description: "Visual guide on how to report cybercrimes to the National Cyber Crime Reporting Portal.",
            link: "#",
            tag: "Legal"
        }
    ];

    res.json(resources);
};
