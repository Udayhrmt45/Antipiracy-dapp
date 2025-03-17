import { ethers } from "ethers";
import { CONTRACT_ABI } from "@/app/constants/constants";

const contractAddress = process.env.CONTRACT_ADDRESS;
console.log(contractAddress);

const getContract = async () =>{
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, CONTRACT_ABI, signer);
};

export const uploadContent = async (contentId, price) =>{
    const contract = await getContract();
    const tx = await contract.uploadContent(contentId, price);
    await tx.wait();
}

export const buyAccess = async (contentId, price)=>{
    const contract = await getContract();
    const tx = await contract.buyAccess(contentId, {value : price});
    await tx.wait();
};

export const checkAccess = async (contentId, userAddress) => {
    const contract = await getContract();
    return await contract.checkAccess(contentId, userAddress);
};
