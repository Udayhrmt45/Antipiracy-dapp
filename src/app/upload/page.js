"use client";
import React, { useState } from "react";
import { ethers } from "ethers";
import { uploadContent } from "../../../utils/contract";

const page = () => {
  const [file, setFile] = useState("");
  // const [url, setUrl] = useState("");
  const [contentId, setContentId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");

  const uploadFile = async () => {
    try {
      if (!file) {
        alert("No file selected");
        return;
      }
      setUploading(true);
      const data = new FormData();
      data.set("file", file);
      const uploadRequest = await fetch("/api/files", {
        method: "POST",
        body: data,
      });
      const {contentId} = await uploadRequest.json();
      // const signedUrl = await uploadRequest.json();

      console.log(contentId);
      // setUrl(signedUrl);
      setContentId(contentId);
      setUploading(false);
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  const handleChange = (e) => {
    setFile(e.target?.files?.[0]);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="max-w-lg mx-auto p-6 flex flex-col items-center  bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4 text-neutral-950">
          Upload Content
        </h1>
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
          className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700"
        >
          Upload
        </button>
        {uploading && <p>Uploading...</p>}
        {contentId && (
          <div>
            <p>Content ID: {contentId}</p>
            <button
              onClick={async () => {
                await uploadContent(contentId, ethers.utils.parseEther(price));
                setStatus("Content uploaded successfully");
              }}
              className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700"
            >
              Upload to blockchain
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
