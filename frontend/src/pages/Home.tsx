
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <style>
        {`

body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
}


/* FULL SCREEN BACKGROUND */

.home-bg {
  height: 100vh;
  width: 100%;
  background-image: url("https://elie.net/_astro/understanding-the-online-safety-and-privacy-challenges-faced-by-south-asian-women.BTBibnrd_2oWmzs.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
}


/* GRADIENT */

.home-bg::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    rgba(0,0,0,0.55),
    rgba(0,0,0,0.75)
  );
  z-index: 1;
}


/* HERO */

.hero-box {
  position: relative;
  z-index: 2;
  max-width: 820px;
  text-align: center;
  color: white;
  animation: fadeIn 1s ease;
}


@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


/* TITLE */

.hero-box h1 {
  font-size: 52px;
  margin-bottom: 12px;
  font-weight: 700;
}

.hero-box h1 span {
  color: #ef4444;
}


/* SUBTITLE */

.hero-box h2 {
  font-size: 24px;
  margin-bottom: 18px;
  color: #fca5a5;
}


/* TEXT */

.hero-box p {
  font-size: 18px;
  line-height: 1.6;
  color: #e5e7eb;
  margin-bottom: 30px;
}


/* BUTTONS */

.hero-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;

  margin-top: 15px;   /* push buttons down */
}


/* PRIMARY */

.btn-primary {
  background: #dc2626;
  padding: 12px 28px;
  border-radius: 6px;
  text-decoration: none;
  color: white;
  font-weight: 500;
}

.btn-primary:hover {
  background: #b91c1c;
}


/* SECONDARY */

.btn-secondary {
  border: 1px solid white;
  padding: 12px 28px;
  border-radius: 6px;
  text-decoration: none;
  color: white;
}

.btn-secondary:hover {
  background: rgba(255,255,255,0.2);
}


/* TAGLINE */

.tagline {
  margin-top: 40px;   /* push tagline down more */
  font-size: 14px;
  color: #d1d5db;
}

`}
      </style>

      

      <div className="home-bg">

        <div className="hero-box">

          <h1>
            Raksha<span>Net</span>
          </h1>

          <h2>
            Cyberbullying Reporting Platform for Colleges
          </h2>

          <p>
            RakshaNet is a secure campus safety platform designed for
            colleges to report cyberbullying, harassment, and abuse.
            Students can submit complaints anonymously, access therapy,
            request legal help, and track cases through an intelligent
            safety system built for educational institutions.
          </p>

          <div className="hero-buttons">

            <Link to="/register" className="btn-primary">
              Get Started
            </Link>

            <Link to="/login" className="btn-secondary">
              Login
            </Link>

          </div>

          <div className="tagline">
            Secure • Anonymous • AI Powered • Campus Safety Platform
          </div>

        </div>

      </div>
    </>
  );
};

export default Home;