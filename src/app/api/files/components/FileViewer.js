import { useState, useEffect } from 'react';
import { pinata } from '../../../../../utils/config';

const FileViewer = ({ ipfsHash }) => {
  const [fileUrl, setFileUrl] = useState(null);

  useEffect(async() => { // Add async here
    if (ipfsHash) {
      const url = await pinata.gateways.private.get(`${ipfsHash}`);
      setFileUrl(url);
    }
  }, [ipfsHash]);

  if (!fileUrl) return <p>Loading file...</p>;

  return (
    <div>
      <h3>Your File:</h3>
      {fileUrl.endsWith('.mp4') ? (
        <video controls src={fileUrl} width="500" />
      ) : fileUrl.endsWith('.pdf') ? (
        <iframe src={fileUrl} width="500" height="600" />
      ) : (
        <img src={fileUrl} alt="Content" width="500" />
      )}
    </div>
  );
};

export default FileViewer;