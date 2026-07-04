import { useState } from "react";
import api from "../api/api";

function FileUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a PDF");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(res.data.message);

      setFile(null);

      if (onUpload) {
        onUpload();
      }

    } catch (err) {
      console.error(err);
      alert("Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={uploadFile}>
        {loading ? "Uploading..." : "Upload PDF"}
      </button>

    </div>
  );
}

export default FileUpload;