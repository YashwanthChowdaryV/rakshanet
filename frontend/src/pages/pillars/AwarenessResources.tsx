import Navbar from "../../components/Navbar";

const AwarenessResources = () => {
    return (
        <>
            <Navbar />
            <div style={pageStyle}>
                <h2>Awareness & Resources</h2>
                <p>Access educational materials and safety resources.</p>
            </div>
        </>
    );
};

const pageStyle: React.CSSProperties = {
    paddingTop: "120px",
    paddingLeft: "40px",
    paddingRight: "40px",
};

export default AwarenessResources;