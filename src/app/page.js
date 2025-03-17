'use client'
import React from "react";
import { ethers } from "ethers";
import { useState } from "react";
import Connectbutton from "./api/files/components/Connectbutton";

export default function Home() {
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl">Movie Marketplace</h1>
      <p className="mt-4 text-center text-gray-600">
        A decentralized marketplace for movies
      </p>
      <Connectbutton />
      <div className="flex flex-col items-center mt-8">
        <button className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700">
          Upload Movie
        </button>
      </div>
      <div className="flex flex-col items-center mt-8">
        <button className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700">
          Buy Movie
        </button>
      </div>
      <div className="flex flex-col items-center mt-8">
        <button className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700">
          Check Access
        </button>
      </div>
      <div className="flex flex-col items-center mt-8">
        <button className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700">
          Content count
        </button>
      </div>

    </div>
  );
}
