import React, { useState } from "react";
import Tesseract from "tesseract.js";
import "./App.css";

const App = () => {
  const [uploads, setUploads] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    console.log(event.target.files);
    if (event.target.files[0]) {
      let _uploads = [];
      for (let key in event.target.files) {
        if (!event.target.files.hasOwnProperty(key)) continue;
        let upload = event.target.files[key];
        _uploads.push(URL.createObjectURL(upload));
      }
      setUploads(_uploads);
    } else {
      setUploads([]);
    }
  };

  const generateText = () => {
    let _uploads = uploads;
    setLoading(true);
    for (let i = 0; i < _uploads.length; i++) {
      Tesseract.recognize(_uploads[i], "eng", { logger: (m) => console.log(m) })
        .then(({ data }) => {
          console.log(data);
          //Get confidence score
          let confidence = data.confidence;
          //Get full output
          let text = data.text;
          //Get codes
          let pattern = /\b\w{10,10}\b/g;
          let _patterns = text.match(pattern);
          //Update state
          setPatterns(patterns.concat(_patterns));
          setDocuments(
            documents.concat({
              pattern: _patterns,
              text: text,
              confidence: confidence,
            })
          );
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>OCR App (Image Text Reader)</h1>
      </header>

      {/*File Uploader */}
      <section className="hero">
        <label className="fileUploaderContainer">
          CLICK HERE TO UPLOAD DOCUMENTS
          <input
            type="file"
            id="fileUploader"
            multiple
            disabled={loading}
            onChange={handleChange}
          ></input>
        </label>
        <div>
          {uploads.map((u, i) => {
            return <img key={i} src={u} width="250px" alt="textImg" />;
          })}
        </div>
        <button className="button" onClick={() => generateText()}>
          {loading ? "Reading Text..." : "Generate"}
        </button>
      </section>

      {/* Results */}
      <section className="results">
        {documents.map((doc, i) => {
          return (
            <div className="results__result" key={i}>
              <div className="results__result__image">
                <img width="250px" src={uploads[i]} alt="textImg"></img>
              </div>
              <div className="results__result__info">
                <div className="results__result__info__codes">
                  <small>
                    <strong>Confidence Score:</strong> {doc.confidence}
                  </small>
                </div>
                <div className="results__result__info__codes">
                  <small>
                    <strong>Pattern Output:</strong>{" "}
                    {doc.pattern.map((p) => {
                      return p + ", ";
                    })}
                  </small>
                </div>
                <div className="results__result__info__text">
                  <small>
                    <strong>Full Output:</strong> {doc.text}
                  </small>
                </div>
              </div>
              <hr />
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default App;
