// pages/my-files.js
'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MyFiles() {
  const [contents, setContents] = useState([]);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      }
    };
    connectWallet();
  }, []);

  useEffect(() => {
    if (account) {
      const fetchMyContents = async () => {
        const res = await fetch(`/api/files/content/my?userAddress=${account}`);
        const data = await res.json();
        setContents(data);
      };
      fetchMyContents();
    }
  }, [account]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Files</h1>
      <p className="mb-4">{account ? `Connected: ${account}` : 'Please connect your wallet'}</p>
      
      {contents.length === 0 ? (
        <p>You don't have access to any files yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {contents.map((content) => (
            <div key={content.content_id} className="border p-4 rounded-lg">
              <h3 className="font-bold">Content ID: {content.content_id}</h3>
              <Link href={`https://gateway.pinata.cloud/ipfs/${content.ipfs_hash}`}>
                <a className="text-blue-600 hover:underline" target="_blank">
                  View File
                </a>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}