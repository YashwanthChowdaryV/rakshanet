import { useState, useEffect } from "react";

import api from "../../services/api";

const TherapySupport = () => {
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [showEmergency, setShowEmergency] = useState(false);
    const [showBooking, setShowBooking] = useState(false);
    const [selectedCounselor, setSelectedCounselor] = useState("");
    const [selectedCounselorId, setSelectedCounselorId] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);

    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [sessionType, setSessionType] = useState("In-Person");
    const [reason, setReason] = useState("");

    const [appointments, setAppointments] = useState<any[]>([]);
    const [sessions, setSessions] = useState<any[]>([]);

    const [counselorsList, setCounselorsList] = useState<any[]>([]);

    const fetchCounselors = async () => {
        try {
            const res = await api.get("/therapy/counselors");
            if (res.data.length > 0) {
                const mapped = res.data.map((user: any) => ({
                    id: user._id,
                    name: user.name,
                    title: user.profile?.department || "Licensed Counselor",
                    specialization: "General Therapy, Student Support",
                    rating: "4.8",
                    sessions: Math.floor(Math.random() * 50) + 10,
                    next: "Today",
                    availability: ["10:00 AM", "2:00 PM"],
                    image: "👩‍⚕️",
                }));
                setCounselorsList(mapped);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // ================= Enhanced Mood Resources with 6 Books Each =================
    const moodResources: any = {
        Anxious: [
            { title: "The Anxiety and Phobia Workbook", author: "Edmund Bourne", type: "📖 Book", pages: 496, rating: "4.7" },
            { title: "Dare: The New Way to End Anxiety", author: "Barry McDonagh", type: "📖 Book", pages: 288, rating: "4.6" },
            { title: "Hope and Help for Your Nerves", author: "Dr. Claire Weekes", type: "📖 Book", pages: 224, rating: "4.8" },
            { title: "The Worry Trick", author: "David Carbonell", type: "📖 Book", pages: 312, rating: "4.5" },
            { title: "10% Happier", author: "Dan Harris", type: "📖 Book", pages: 256, rating: "4.6" },
            { title: "First, We Make the Beast Beautiful", author: "Sarah Wilson", type: "📖 Book", pages: 336, rating: "4.4" },
        ],
        Sad: [
            { title: "Feeling Good: The New Mood Therapy", author: "David Burns", type: "📖 Book", pages: 736, rating: "4.8" },
            { title: "The Upward Spiral", author: "Alex Korb", type: "📖 Book", pages: 240, rating: "4.6" },
            { title: "Reasons to Stay Alive", author: "Matt Haig", type: "📖 Book", pages: 272, rating: "4.7" },
            { title: "Lost Connections", author: "Johann Hari", type: "📖 Book", pages: 304, rating: "4.5" },
            { title: "The Noonday Demon", author: "Andrew Solomon", type: "📖 Book", pages: 576, rating: "4.6" },
            { title: "Mind Over Mood", author: "Dennis Greenberger", type: "📖 Book", pages: 264, rating: "4.7" },
        ],
        Distressed: [
            { title: "The Body Keeps the Score", author: "Bessel van der Kolk", type: "📖 Book", pages: 464, rating: "4.9" },
            { title: "Trauma and Recovery", author: "Judith Herman", type: "📖 Book", pages: 336, rating: "4.7" },
            { title: "Waking the Tiger", author: "Peter Levine", type: "📖 Book", pages: 288, rating: "4.5" },
            { title: "The Complex PTSD Workbook", author: "Arielle Schwartz", type: "📖 Book", pages: 224, rating: "4.6" },
            { title: "What Happened to You?", author: "Bruce Perry & Oprah", type: "📖 Book", pages: 304, rating: "4.8" },
            { title: "It Didn't Start with You", author: "Mark Wolynn", type: "📖 Book", pages: 256, rating: "4.5" },
        ],
        Lonely: [
            { title: "Together: The Healing Power of Connection", author: "Vivek Murthy", type: "📖 Book", pages: 320, rating: "4.7" },
            { title: "Loneliness: Human Nature", author: "John Cacioppo", type: "📖 Book", pages: 336, rating: "4.5" },
            { title: "The Art of Solitude", author: "Stephen Batchelor", type: "📖 Book", pages: 224, rating: "4.4" },
            { title: "Platonic", author: "Marisa G. Franco", type: "📖 Book", pages: 320, rating: "4.6" },
            { title: "The Lonely City", author: "Olivia Laing", type: "📖 Book", pages: 336, rating: "4.5" },
            { title: "How to Be Alone", author: "Sara Maitland", type: "📖 Book", pages: 288, rating: "4.3" },
        ],
        Angry: [
            { title: "Anger: Wisdom for Cooling the Flames", author: "Thich Nhat Hanh", type: "📖 Book", pages: 240, rating: "4.6" },
            { title: "When Anger Hurts", author: "Matthew McKay", type: "📖 Book", pages: 328, rating: "4.5" },
            { title: "The Dance of Anger", author: "Harriet Lerner", type: "📖 Book", pages: 256, rating: "4.5" },
            { title: "Anger Management Workbook", author: "Peter Salerno", type: "📖 Book", pages: 224, rating: "4.4" },
            { title: "Letting Go of Anger", author: "Annie Chapman", type: "📖 Book", pages: 208, rating: "4.3" },
            { title: "The Cow in the Parking Lot", author: "Leonard Scheff", type: "📖 Book", pages: 192, rating: "4.4" },
        ],
        Happy: [
            { title: "The Happiness Advantage", author: "Shawn Achor", type: "📖 Book", pages: 256, rating: "4.6" },
            { title: "Stumbling on Happiness", author: "Daniel Gilbert", type: "📖 Book", pages: 336, rating: "4.5" },
            { title: "The How of Happiness", author: "Sonja Lyubomirsky", type: "📖 Book", pages: 384, rating: "4.5" },
            { title: "Authentic Happiness", author: "Martin Seligman", type: "📖 Book", pages: 336, rating: "4.4" },
            { title: "Happiness by Design", author: "Paul Dolan", type: "📖 Book", pages: 256, rating: "4.3" },
            { title: "The Art of Happiness", author: "Dalai Lama", type: "📖 Book", pages: 352, rating: "4.7" },
        ],
        Neutral: [
            { title: "Wherever You Go, There You Are", author: "Jon Kabat-Zinn", type: "📖 Book", pages: 304, rating: "4.6" },
            { title: "The Miracle of Mindfulness", author: "Thich Nhat Hanh", type: "📖 Book", pages: 160, rating: "4.7" },
            { title: "Mindfulness for Beginners", author: "Jon Kabat-Zinn", type: "📖 Book", pages: 192, rating: "4.5" },
            { title: "Radical Acceptance", author: "Tara Brach", type: "📖 Book", pages: 352, rating: "4.6" },
            { title: "The Power of Now", author: "Eckhart Tolle", type: "📖 Book", pages: 256, rating: "4.7" },
            { title: "Real Happiness", author: "Sharon Salzberg", type: "📖 Book", pages: 288, rating: "4.5" },
        ],
    };

    // ================= Fetch Appointments =================
    const fetchAppointments = async () => {
        try {
            const res = await api.get("/therapy/my");
            setAppointments(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchSessions = async () => {
        try {
            const res = await api.get("/counselor/session/student/my");
            setSessions(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchAppointments();
        fetchCounselors();
        fetchSessions();
    }, []);

    // ================= Book Appointment =================
    const bookSession = async () => {
        try {
            await api.post("/therapy/book", {
                counselorName: selectedCounselor,
                counselorId: selectedCounselorId,
                date,
                time,
                sessionType,
                reason,
            });

            setShowConfirmation(true);
            setShowBooking(false);
            setDate("");
            setTime("");
            setReason("");
            fetchAppointments();

            setTimeout(() => setShowConfirmation(false), 4000);
        } catch (err: any) {
            alert(err.response?.data?.message || "Booking Failed");
        }
    };

    return (
        <>
            <style>
                {`
                    /* ========== PINK THEME STYLES ========== */
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }

                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                        background: linear-gradient(135deg, #fff5f8 0%, #ffe8f0 100%);
                    }

                    .therapy-wrapper {
                        padding-top: 100px;
                        padding-left: 40px;
                        padding-right: 40px;
                        padding-bottom: 80px;
                        min-height: 100vh;
                    }

                    .therapy-container {
                        max-width: 1200px;
                        margin: 0 auto;
                    }

                    /* ========== HERO SECTION WITH IMAGE SIDE BY SIDE ========== */
                    .hero-section {
                        display: grid;
                        grid-template-columns: 1fr 320px;
                        gap: 40px;
                        margin-bottom: 40px;
                        background: white;
                        border-radius: 24px;
                        overflow: hidden;
                        box-shadow: 0 4px 20px rgba(219, 39, 119, 0.08);
                        border: 1px solid #ffe0ed;
                        align-items: center;
                    }

                    .hero-content {
                        padding: 40px;
                    }

                    .hero-content .main-title {
                        font-size: 32px;
                        font-weight: 700;
                        color: #b83280;
                        margin-bottom: 12px;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }

                    .hero-content .subtitle {
                        color: #9b6b7c;
                        font-size: 16px;
                        line-height: 1.5;
                    }

                    .hero-image-wrapper {
                        padding: 20px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background: linear-gradient(135deg, #fff0f5 0%, #ffe4ed 100%);
                        height: 100%;
                    }

                    .hero-image {
                        width: 100%;
                        height: auto;
                        max-height: 280px;
                        object-fit: contain;
                        border-radius: 16px;
                    }

                    @media (max-width: 768px) {
                        .hero-section {
                            grid-template-columns: 1fr;
                        }
                        .hero-image-wrapper {
                            order: -1;
                            padding: 30px;
                        }
                        .hero-content {
                            padding: 30px;
                        }
                        .hero-content .main-title {
                            font-size: 28px;
                        }
                        .therapy-wrapper {
                            padding: 80px 16px 40px;
                        }
                    }

                    /* ========== Emergency Button ========== */
                    .emergency-btn {
                        background-color: #db2777;
                        color: white;
                        padding: 12px 24px;
                        border: none;
                        border-radius: 40px;
                        font-weight: 600;
                        font-size: 16px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        margin-bottom: 20px;
                        box-shadow: 0 2px 8px rgba(219, 39, 119, 0.3);
                    }

                    .emergency-btn:hover {
                        background-color: #be185d;
                        transform: translateY(-1px);
                        box-shadow: 0 4px 12px rgba(219, 39, 119, 0.4);
                    }

                    .emergency-box {
                        background-color: #ffe4ed;
                        border-left: 4px solid #db2777;
                        padding: 20px;
                        border-radius: 16px;
                        margin-bottom: 30px;
                    }

                    .emergency-box p {
                        margin: 8px 0;
                        color: #9d174d;
                        font-weight: 500;
                    }

                    /* ========== Section Headers ========== */
                    .section-header {
                        font-size: 24px;
                        font-weight: 600;
                        color: #b83280;
                        margin: 40px 0 20px 0;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }

                    /* ========== Mood Grid ========== */
                    .mood-grid {
                        display: flex;
                        gap: 12px;
                        flex-wrap: wrap;
                        margin-bottom: 20px;
                    }

                    .mood-btn {
                        padding: 10px 20px;
                        border-radius: 40px;
                        border: 2px solid #ec489a;
                        background: white;
                        color: #db2777;
                        font-weight: 500;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        font-size: 15px;
                    }

                    .mood-btn:hover {
                        background: #ffe4ed;
                        border-color: #db2777;
                    }

                    .mood-btn.active {
                        background: #db2777;
                        color: white;
                        border-color: #db2777;
                    }

                    /* ========== Book Grid ========== */
                    .books-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                        gap: 20px;
                        margin-top: 20px;
                    }

                    .book-card {
                        background: white;
                        padding: 20px;
                        border-radius: 20px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                        border: 1px solid #ffe0ed;
                        transition: all 0.2s ease;
                    }

                    .book-card:hover {
                        box-shadow: 0 8px 24px rgba(219, 39, 119, 0.1);
                        transform: translateY(-2px);
                        border-color: #ec489a;
                    }

                    .book-title {
                        font-size: 16px;
                        font-weight: 600;
                        color: #831843;
                        margin-bottom: 6px;
                    }

                    .book-author {
                        font-size: 14px;
                        color: #9b6b7c;
                        margin-bottom: 8px;
                    }

                    .book-meta {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-top: 12px;
                        padding-top: 12px;
                        border-top: 1px solid #ffe0ed;
                    }

                    .book-rating {
                        background: #fbc4d5;
                        color: #831843;
                        padding: 4px 8px;
                        border-radius: 20px;
                        font-size: 12px;
                        font-weight: 600;
                    }

                    .book-pages {
                        font-size: 12px;
                        color: #b86f88;
                    }

                    .book-action {
                        background: #ffe4ed;
                        border: none;
                        padding: 6px 12px;
                        border-radius: 20px;
                        font-size: 13px;
                        color: #db2777;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    }

                    .book-action:hover {
                        background: #fbc4d5;
                    }

                    /* ========== Counselor Cards ========== */
                    .counselor-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                        gap: 24px;
                        margin-bottom: 40px;
                    }

                    .counselor-card {
                        background: white;
                        padding: 24px;
                        border-radius: 24px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                        border: 1px solid #ffe0ed;
                        transition: all 0.2s ease;
                    }

                    .counselor-card:hover {
                        box-shadow: 0 8px 24px rgba(219, 39, 119, 0.1);
                        transform: translateY(-2px);
                        border-color: #ec489a;
                    }

                    .counselor-header {
                        display: flex;
                        gap: 16px;
                        margin-bottom: 16px;
                    }

                    .counselor-avatar {
                        font-size: 48px;
                    }

                    .counselor-info h4 {
                        font-size: 18px;
                        font-weight: 600;
                        color: #831843;
                        margin-bottom: 4px;
                    }

                    .counselor-title {
                        font-size: 14px;
                        color: #9b6b7c;
                        margin-bottom: 6px;
                    }

                    .counselor-rating {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        margin-bottom: 12px;
                    }

                    .rating-badge {
                        background: #fbc4d5;
                        padding: 4px 8px;
                        border-radius: 20px;
                        font-weight: 600;
                        font-size: 13px;
                        color: #831843;
                    }

                    .sessions-count {
                        color: #b86f88;
                        font-size: 13px;
                    }

                    .specialization {
                        font-size: 14px;
                        color: #6b4c5c;
                        margin-bottom: 12px;
                        line-height: 1.5;
                    }

                    .availability {
                        background: #ffe4ed;
                        color: #db2777;
                        padding: 8px 12px;
                        border-radius: 40px;
                        font-size: 14px;
                        font-weight: 500;
                        margin: 16px 0;
                    }

                    .book-btn {
                        width: 100%;
                        background: #db2777;
                        color: white;
                        border: none;
                        padding: 12px;
                        border-radius: 40px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    }

                    .book-btn:hover {
                        background: #be185d;
                        transform: translateY(-1px);
                    }

                    /* ========== Booking Modal ========== */
                    .modal-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.5);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 1000;
                        animation: fadeIn 0.3s ease;
                    }

                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }

                    .modal-content {
                        background: white;
                        padding: 32px;
                        border-radius: 28px;
                        width: 450px;
                        max-width: 90%;
                        animation: slideUp 0.3s ease;
                        border: 1px solid #ffe0ed;
                    }

                    @keyframes slideUp {
                        from {
                            transform: translateY(20px);
                            opacity: 0;
                        }
                        to {
                            transform: translateY(0);
                            opacity: 1;
                        }
                    }

                    .modal-content h3 {
                        font-size: 22px;
                        font-weight: 600;
                        color: #b83280;
                        margin-bottom: 20px;
                    }

                    .form-group {
                        margin-bottom: 16px;
                    }

                    .form-label {
                        display: block;
                        font-size: 14px;
                        font-weight: 500;
                        color: #9b6b7c;
                        margin-bottom: 6px;
                    }

                    .form-input {
                        width: 100%;
                        padding: 12px;
                        border: 1px solid #ffe0ed;
                        border-radius: 16px;
                        font-size: 15px;
                        transition: all 0.2s ease;
                    }

                    .form-input:focus {
                        outline: none;
                        border-color: #db2777;
                        box-shadow: 0 0 0 3px rgba(219, 39, 119, 0.1);
                    }

                    .modal-actions {
                        display: flex;
                        gap: 12px;
                        margin-top: 24px;
                    }

                    .confirm-btn {
                        flex: 1;
                        background: #db2777;
                        color: white;
                        border: none;
                        padding: 12px;
                        border-radius: 40px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    }

                    .confirm-btn:hover {
                        background: #be185d;
                    }

                    .cancel-btn {
                        flex: 1;
                        background: #ffe4ed;
                        color: #db2777;
                        border: none;
                        padding: 12px;
                        border-radius: 40px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    }

                    .cancel-btn:hover {
                        background: #fbc4d5;
                    }

                    /* ========== Confirmation Toast ========== */
                    .confirmation-toast {
                        position: fixed;
                        top: 120px;
                        right: 30px;
                        background: #db2777;
                        color: white;
                        padding: 16px 24px;
                        border-radius: 40px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                        animation: slideIn 0.3s ease;
                        z-index: 1001;
                    }

                    @keyframes slideIn {
                        from {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }

                    /* ========== Appointments Section ========== */
                    .appointments-section {
                        margin-top: 50px;
                    }

                    .appointment-card {
                        background: white;
                        padding: 20px;
                        margin-bottom: 12px;
                        border-radius: 20px;
                        border: 1px solid #ffe0ed;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        transition: all 0.2s ease;
                    }

                    .appointment-card:hover {
                        border-color: #ec489a;
                    }

                    .appointment-info h4 {
                        font-size: 16px;
                        font-weight: 600;
                        color: #831843;
                        margin-bottom: 6px;
                    }

                    .session-card {
                        background: #ffe4ed;
                        padding: 20px;
                        margin-bottom: 12px;
                        border-radius: 20px;
                        border: 1px solid #fbc4d5;
                    }

                    .session-card h4 {
                        font-size: 16px;
                        font-weight: 600;
                        color: #b83280;
                        margin-bottom: 6px;
                    }

                    .appointment-details {
                        display: flex;
                        gap: 20px;
                        font-size: 14px;
                        color: #9b6b7c;
                    }

                    .status-badge {
                        padding: 6px 12px;
                        border-radius: 40px;
                        font-size: 13px;
                        font-weight: 500;
                    }

                    .status-confirmed, .status-upcoming {
                        background: #ffe4ed;
                        color: #db2777;
                        text-transform: capitalize;
                    }

                    .status-pending {
                        background: #fff0e0;
                        color: #c97e3e;
                        text-transform: capitalize;
                    }

                    .status-completed {
                        background: #e0f5e8;
                        color: #2f6b47;
                        text-transform: capitalize;
                    }

                    .status-cancelled {
                        background: #ffe0ed;
                        color: #db2777;
                        text-transform: capitalize;
                    }

                    /* ========== Empty State ========== */
                    .empty-state {
                        text-align: center;
                        padding: 40px;
                        background: white;
                        border-radius: 24px;
                        color: #b86f88;
                        border: 1px solid #ffe0ed;
                    }

                    /* ========== Responsive Design ========== */
                    @media (max-width: 768px) {
                        .counselor-grid {
                            grid-template-columns: 1fr;
                        }

                        .books-grid {
                            grid-template-columns: 1fr;
                        }

                        .appointment-card {
                            flex-direction: column;
                            align-items: flex-start;
                            gap: 12px;
                        }

                        .appointment-details {
                            flex-direction: column;
                            gap: 6px;
                        }

                        .confirmation-toast {
                            top: 80px;
                            right: 16px;
                            left: 16px;
                            text-align: center;
                        }
                    }
                `}
            </style>

            <div className="therapy-wrapper">
                <div className="therapy-container">
                    {/* Hero Section with Image on Right */}
                    <div className="hero-section">
                        <div className="hero-content">
                            <h1 className="main-title">🧘 Therapy & Mental Health Support</h1>
                            <p className="subtitle">
                                Confidential emotional support for students affected by cyber incidents.
                                All sessions are private and secure with licensed professionals.
                            </p>
                        </div>
                        <div className="hero-image-wrapper">
                            <img
                                src="https://as2.ftcdn.net/jpg/04/14/31/39/1000_F_414313961_aGTslco13WzNyIo9lp9pX7LhQb9edQu4.jpg"
                                alt="Mental Health Support"
                                className="hero-image"
                            />
                        </div>
                    </div>

                    {/* Emergency Button */}
                    <button
                        className="emergency-btn"
                        onClick={() => setShowEmergency(!showEmergency)}
                    >
                        🚨 Emergency? Click for Immediate Support
                    </button>

                    {showEmergency && (
                        <div className="emergency-box">
                            <p>🇮🇳 National Helpline: 1800-XXX-XXXX (24/7)</p>
                            <p>🏥 College Counselor On-Call: +91 XXXXX XXXXX</p>
                            <p>🚓 Emergency Contact: 112</p>
                            <p>⏱️ Someone will respond within 30 minutes</p>
                        </div>
                    )}

                    {/* Mood Check-In Section */}
                    <h2 className="section-header">🌤️ How are you feeling today?</h2>
                    <div className="mood-grid">
                        {["Happy", "Neutral", "Sad", "Distressed", "Angry", "Anxious", "Lonely"].map(
                            (mood) => (
                                <button
                                    key={mood}
                                    className={`mood-btn ${selectedMood === mood ? "active" : ""}`}
                                    onClick={() => setSelectedMood(mood)}
                                >
                                    {mood}
                                </button>
                            )
                        )}
                    </div>

                    {/* Book Recommendations */}
                    {selectedMood && moodResources[selectedMood] && (
                        <div style={{ marginTop: "30px" }}>
                            <h3 style={{ fontSize: "20px", marginBottom: "16px", color: "#b83280" }}>
                                📚 Recommended Books for {selectedMood} Mood
                            </h3>
                            <div className="books-grid">
                                {moodResources[selectedMood].map((book: any, index: number) => (
                                    <div key={index} className="book-card">
                                        <div className="book-title">{book.title}</div>
                                        <div className="book-author">by {book.author}</div>
                                        <div className="book-meta">
                                            <span className="book-rating">⭐ {book.rating}</span>
                                            <span className="book-pages">{book.pages} pages</span>
                                            <button className="book-action">View Details</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Book Counseling Section */}
                    <h2 className="section-header">📅 Book a Counseling Session</h2>
                    <div className="counselor-grid">
                        {counselorsList.map((c, index) => (
                            <div key={index} className="counselor-card">
                                <div className="counselor-header">
                                    <span className="counselor-avatar">{c.image}</span>
                                    <div className="counselor-info">
                                        <h4>{c.name}</h4>
                                        <div className="counselor-title">{c.title}</div>
                                    </div>
                                </div>

                                <div className="counselor-rating">
                                    <span className="rating-badge">⭐ {c.rating}</span>
                                    <span className="sessions-count">{c.sessions} sessions</span>
                                </div>

                                <div className="specialization">
                                    <strong>Specializes in:</strong> {c.specialization}
                                </div>

                                <div className="availability">
                                    🟢 Next Available: {c.next}
                                </div>

                                <button
                                    className="book-btn"
                                    onClick={() => {
                                        setSelectedCounselor(c.name);
                                        setSelectedCounselorId(c.id);
                                        setShowBooking(true);
                                    }}
                                >
                                    Book Appointment
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Booking Modal */}
                    {showBooking && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <h3>Book Appointment with {selectedCounselor}</h3>

                                <div className="form-group">
                                    <label className="form-label">Select Date</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Select Time</label>
                                    <select
                                        className="form-input"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                    >
                                        <option value="">Choose a time slot</option>
                                        <option value="9:00 AM">9:00 AM - 9:50 AM</option>
                                        <option value="10:00 AM">10:00 AM - 10:50 AM</option>
                                        <option value="11:00 AM">11:00 AM - 11:50 AM</option>
                                        <option value="2:00 PM">2:00 PM - 2:50 PM</option>
                                        <option value="3:00 PM">3:00 PM - 3:50 PM</option>
                                        <option value="4:00 PM">4:00 PM - 4:50 PM</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Session Type</label>
                                    <select
                                        className="form-input"
                                        value={sessionType}
                                        onChange={(e) => setSessionType(e.target.value)}
                                    >
                                        <option value="In-Person">In-Person (Counseling Center)</option>
                                        <option value="Video Call">Video Call (Google Meet)</option>
                                        <option value="Phone Call">Phone Call</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Reason (Optional)</label>
                                    <textarea
                                        className="form-input"
                                        placeholder="Briefly describe what you'd like to discuss..."
                                        rows={3}
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                    />
                                </div>

                                <div className="modal-actions">
                                    <button className="confirm-btn" onClick={bookSession}>
                                        Confirm Booking
                                    </button>
                                    <button className="cancel-btn" onClick={() => setShowBooking(false)}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Confirmation Toast */}
                    {showConfirmation && (
                        <div className="confirmation-toast">
                            ✅ Appointment Confirmed! Check your email for details.
                        </div>
                    )}

                    {/* My Appointments Section */}
                    <h2 className="section-header">📋 My Appointments</h2>

                    {appointments.length === 0 ? (
                        <div className="empty-state">
                            <p>No appointments booked yet.</p>
                            <p style={{ fontSize: "14px", marginTop: "8px" }}>
                                Book your first session with one of our counselors above.
                            </p>
                        </div>
                    ) : (
                        <div className="appointments-section">
                            {appointments.map((app, index) => (
                                <div key={index} className="appointment-card">
                                    <div className="appointment-info">
                                        <h4>{app.counselorName}</h4>
                                        <div className="appointment-details">
                                            <span>📅 {app.date}</span>
                                            <span>⏰ {app.time}</span>
                                            <span>📞 {app.sessionType}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className={`status-badge status-${app.status?.toLowerCase() || 'upcoming'}`}>
                                            {app.status || "Upcoming"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <h2 className="section-header">🧾 My Counseling History</h2>
                    {sessions.length === 0 ? (
                        <div className="empty-state">
                            <p>No past sessions found.</p>
                        </div>
                    ) : (
                        sessions.map((session, index) => (
                            <div key={index} className="session-card">
                                <h4>Session with {session.counselor?.name || "Counselor"}</h4>
                                <div className="appointment-details">
                                    <span>📅 {new Date(session.createdAt).toLocaleDateString()}</span>
                                    <span>🧠 Mood: {session.mood}</span>
                                    <span>✔ Needs: {session.recommendation || "Continued support recommended"}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default TherapySupport;