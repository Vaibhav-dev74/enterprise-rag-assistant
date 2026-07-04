import { useEffect, useState } from "react";
import api from "../api/api";
import FileUpload from "./FileUpload";

function Sidebar() {
  const [documents, setDocuments] = useState([]);

  const loadDocuments = async () => {
    try {
      const res = await api.get("/documents");
      setDocuments(res.data.documents);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  return (
    <div
      style={{
        width: "280px",
        background: "#1f2937",
        color: "white",
        padding: "20px",
        overflowY: "auto",
      }}
    >
      <h2>Enterprise RAG</h2>

      <hr />
      <br />

      <FileUpload onUpload={loadDocuments} />

      <br />
      <hr />
      <br />

      <h3>Documents</h3>

      {documents.length === 0 ? (
        <p>No documents found</p>
      ) : (
        documents.map((doc, index) => (
          <div
            key={index}
            style={{
              marginTop: "10px",
              padding: "8px",
              background: "#374151",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            📄 {doc}
          </div>
        ))
      )}
    </div>
  );
}

export default Sidebar;