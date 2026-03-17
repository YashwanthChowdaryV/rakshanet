import Navbar from "../../components/Navbar";

const AcademicSupport = () => {
    return (
        <>
            <Navbar />
            <div style={pageStyle}>
                <h2>Academic Support</h2>
                <p>Request mentoring and academic assistance plans.</p>
            </div>
        </>
    );
};

const pageStyle: React.CSSProperties = {
    paddingTop: "120px",
    paddingLeft: "40px",
    paddingRight: "40px",
};

export default AcademicSupport;