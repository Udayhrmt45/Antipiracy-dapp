'use client'
import React, { useEffect, useState } from 'react'


const Connectbutton = () => {
    
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if(window.ethereum){
      try{
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      }catch(error){
        console.log(error);
      }
    }
  }

  useEffect(() => {
    if(window.ethereum){
        window.ethereum.on('accountsChanged', (accounts) => {
            if(accounts.length > 0){
                setAccount(accounts[0]);
            }else{
                setAccount(null);
            }
        });
        }
    }, []);

  return (
    <div className="flex flex-col items-center mt-8">
      <p className="text-center text-gray-600">
        {account ? account : "Connect to Wallet"}
      </p>
      <button onClick={connectWallet} className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700">
        Connect Wallet
      </button>
    </div>
  )
}

export default Connectbutton