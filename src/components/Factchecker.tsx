import React, { useState } from 'react';
import axios from 'axios';
import styles from './Factchecker.module.css';

const Factchecker: React.FC<{ onResult: (result: any) => void }> = ({ onResult }) => {
  const [inputText, setInputText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleVerifyClaim = async () => {
    if (!inputText && !file) {
      setError('Please provide a text claim or upload an image.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      if (inputText) {
        formData.append('text', inputText);
      }
      if (file) {
        formData.append('file', file);
      }

      const response = await axios.post(
        'https://u-factchecker-1009734859869.us-central1.run.app/verify-claim/',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      onResult(response.data);
    } catch (err) {
      setError('An error occurred while verifying the claim.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.factchecker}>
      <h2>Factchecker</h2>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter a claim to verify..."
        className={styles.textArea}
      ></textarea>
      <p>OR</p>
      <input type="file" onChange={handleFileChange} className={styles.fileInput} />
      <button onClick={handleVerifyClaim} disabled={uploading} className={styles.uploadButton}>
        {uploading ? 'Verifying...' : 'Verify Claim'}
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default Factchecker;
