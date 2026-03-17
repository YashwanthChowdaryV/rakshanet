import Navbar from "../../components/Navbar";

const EvidenceVault = () => {
    return (
        <>
            <Navbar />
            <div style={pageStyle}>
                <h2>Evidence Vault</h2>
                <p>Securely upload and manage encrypted evidence files.</p>
            </div>
        </>
    );
};

const pageStyle: React.CSSProperties = {
    paddingTop: "120px",
    paddingLeft: "40px",
    paddingRight: "40px",
};

export default EvidenceVault;