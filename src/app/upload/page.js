"use client";
import React, { useState } from "react";
import { ethers } from "ethers";
import { uploadContent } from "../../../utils/contract";
import { CONTRACT_ADDRESS } from "../constants/constants";
import Connectbutton from "../api/files/components/Connectbutton";


const page = () => {
  const [file, setFile] = useState("");
  // const [url, setUrl] = useState("");
  const [contentId, setContentId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contentId);
    alert("Copied to clipboard!");
  };

  const uploadFile = async () => {
    if (!file || !price) {
      alert("Please select a file and set a price!");
      return;
    }
    setIsLoading(true);
    try {
      // if (!file) {
      //   alert("No file selected");
      //   return;
      // }
      // setUploading(true);
      const data = new FormData();
      data.set("file", file);
      data.set('creatorAddress', account);
      data.set("priceEth", price);
      const uploadRequest = await fetch("/api/files", {
        method: "POST",
        body: data,
      });
      const { contentId, url } = await uploadRequest.json();
      // const signedUrl = await uploadRequest.json();
      setContentId(contentId);
      // console.log(contentId);
      console.log(url);
      console.log(price);
      // setUrl(signedUrl);

      const contractAddress = CONTRACT_ADDRESS;
      if (!contractAddress) {
        throw new Error("Contract address not configured!");
      }

      await uploadContent(
        contentId,
        ethers.utils.parseEther(price),
        contractAddress
      );

      setStatus("File uploaded to blockchain successfully!");
      alert("File uploaded to blockchain successfully!");

      // setContentId(contentId);
      // setUploading(false);
    } catch (e) {
      console.error("Upload failed:", e);
      setStatus("Upload failed. See console for details.");
      // setUploading(false);
      alert("Trouble uploading file");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFile(e.target?.files?.[0]);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="max-w-lg mx-auto p-6 flex flex-col items-center  bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4 text-neutral-950">
          Upload Content
        </h1>
        <Connectbutton onAddressChange={setAccount} />
        <input
          type="file"
          onChange={handleChange}
          className="block w-full p-2 border rounded mb-4 text-black font-light cursor-pointer"
        />
        <input
          type="text"
          placeholder="Price in ETH"
          value={price}
          onChange={handlePriceChange}
          className="block w-full p-2 border rounded mb-4 text-black "
        />

        <button
          onClick={uploadFile}
          disabled={isLoading}
          className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? "Processing..." : "Upload to Blockchain"}
        </button>

        {contentId && (
          <div className="mt-4 w-full">
            <p className="text-sm mb-2">Content ID:</p>
            <div className="flex items-center gap-2">
              <p className="p-2 bg-gray-100 rounded text-sm break-all">
                {contentId}
              </p>
              <button
                onClick={copyToClipboard}
                className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                title="Copy to clipboard"
              >
                📋
              </button>
            </div>
          </div>
        )}

        {status && (
          <p
            className={`mt-4 text-sm ${
              status.includes("failed") ? "text-red-500" : "text-green-500"
            }`}
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
};

export default page;
