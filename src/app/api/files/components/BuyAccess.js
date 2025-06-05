import { useState } from 'react';
import { buyAccess, checkAccess } from '../../../../../utils/contract';
import { ethers } from 'ethers';

const BuyAccess = ({ contentId, price }) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBuyAccess = async () => {
    setLoading(true);
    try {
      await buyAccess(contentId, ethers.utils.parseEther(price));
      setHasAccess(true);
      alert("Access granted!");
    } catch (error) {
      console.error(error);
      alert("Failed to buy access.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAccess = async () => {
    const access = await checkAccess(contentId);
    setHasAccess(access);
  };

  return (
    <div>
      <button onClick={handleBuyAccess} disabled={loading}>
        {loading ? "Processing..." : `Buy Access (${price} ETH)`}
      </button>
      <button onClick={handleCheckAccess}>Check Access</button>
      {hasAccess && <p>✅ You have access to this content!</p>}
    </div>
  );
};

export default BuyAccess;