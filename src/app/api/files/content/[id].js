import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { checkAccess } from '../../../../../utils/contract';
import BuyAccess from '../components/BuyAccess';
import FileViewer from '../components/FileViewer';


const ContentPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [hasAccess, setHasAccess] = useState(false);
  const [ipfsHash, setIpfsHash] = useState(null);
  const [price, setPrice] = useState('0.001'); // Fetch from contract if dynamic

  useEffect(() => {
    const verifyAccess = async () => {
      const access = await checkAccess(id);
      setHasAccess(access);
    };
    if (id) verifyAccess();
  }, [id]);

  // Fetch IPFS hash from contract or backend (replace with your logic)
  useEffect(() => {
    if (hasAccess) {
      const fetchIpfsHash = async () => {
        // Example: Replace with actual contract call
        const response = await fetch(`/api/files/content/${id}`);
        const data = await response.json();
        setIpfsHash(data.ipfsHash);
      };
      fetchIpfsHash();
    }
  }, [hasAccess, id]);

  return (
    <div>
      <h1>Content #{id}</h1>
      {hasAccess ? (
        <FileViewer ipfsHash={ipfsHash} />
      ) : (
        <BuyAccess contentId={id} price={price} />
      )}
    </div>
  );
};

export default ContentPage;