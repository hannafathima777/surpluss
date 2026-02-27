import "./Loading.css";

function Loading() {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="ledger-lines">
          <div className="line thick"></div>
          <div className="line thin"></div>
        </div>
        <h2 className="loading-text">System Loading</h2>
        <div className="progress-container">
          <div className="progress-bar"></div>
        </div>
        <p className="loading-sub">Establishing Secure Connection</p>
      </div>
    </div>
  );
}

export default Loading;