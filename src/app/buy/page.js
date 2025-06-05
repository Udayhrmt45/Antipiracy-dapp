// pages/buy.js
'use client'
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { CONTRACT_ABI } from '../constants/constants';

export default function BuyAccess() {
  const [contents, setContents] = useState([]);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const res = await fetch('/api/files/content/all');
        const data = await res.json();
        setContents(data);
      } catch (error) {
        console.error('Failed to fetch contents:', error);
      }
    };

    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
          });
          setAccount(accounts[0]);
        } catch (error) {
          console.error('Wallet connection error:', error);
        }
      }
    };

    fetchContents();
    connectWallet();
  }, []);

  const handleBuyAccess = async (contentId, priceEth) => {
    if (!account) {
      alert('Please connect your wallet first');
      return;
    }

    setLoading(true);

    try {
      // 1. Setup provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // 2. Check contract address
      if (!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
        throw new Error('Contract address not configured');
      }

      // 3. Create contract instance
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      // 4. Estimate gas (optional but recommended)
      let gasEstimate;
      try {
        gasEstimate = await contract.estimateGas.buyAccess(contentId, {
          value: ethers.utils.parseEther(priceEth.toString())
        });
      } catch (estimateError) {
        console.warn('Gas estimation failed, using default:', estimateError);
        gasEstimate = ethers.BigNumber.from(300000); // Fallback value
      }

      // 5. Send transaction directly (MetaMask will handle signing)
      const tx = await contract.buyAccess(contentId, {
        value: ethers.utils.parseEther(priceEth.toString()),
        gasLimit: gasEstimate.mul(120).div(100) // 20% buffer
      });

      // 6. Wait for transaction to be mined
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        // alert(`Purchase successful! Transaction hash: ${tx.hash}`);
        // Optional: Refresh content list
        const backendResponse = await fetch('/api/files/content/buy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contentId,
            userAddress: account,
            txHash: tx.hash
          }),
        });
  
        const backendResult = await backendResponse.json();
  
        if (!backendResponse.ok) {
          throw new Error(backendResult.error || 'Backend processing failed');
        }
  
        alert('Purchase and access granted successfully!');
  
      } else {
        throw new Error('Transaction failed on-chain');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      
      let errorMessage = error.message;
      if (error.code === 'ACTION_REJECTED') {
        errorMessage = 'Transaction was rejected by user';
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = 'Insufficient funds for transaction';
      }
      
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Available Content</h1>
      <p className="mb-4">
        {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : 'Please connect your wallet'}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {contents.map((content) => (
          <div key={content.content_id} className="border p-4 rounded-lg">
            <h3 className="font-bold">Content ID: {content.content_id}</h3>
            <p>Price: {content.price_eth} ETH</p>
            <button
              onClick={() => handleBuyAccess(content.content_id, content.price_eth)}
              disabled={loading}
              className={`mt-2 px-4 py-2 rounded ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {loading ? 'Processing...' : 'Buy Access'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}