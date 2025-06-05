import { NextResponse } from 'next/server';
import pool from '../../../../../../utils/db';
import { ethers } from 'ethers';
import { CONTRACT_ABI } from '@/app/constants/constants';

// src/app/api/files/content/buy/route.js;

// Initialize provider (use your preferred RPC)
const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_RPC_URL);

export async function POST(request) {
  try {
    const { contentId, userAddress, txHash } = await request.json();

    // 1. Validate inputs
    if (!contentId || !userAddress || !txHash) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 2. Verify the transaction
    const txReceipt = await provider.getTransactionReceipt(txHash);
    
    if (!txReceipt) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    if (txReceipt.status !== 1) {
      return NextResponse.json(
        { error: 'Transaction failed on-chain' },
        { status: 400 }
      );
    }

    // 3. Verify transaction details match request
    const tx = await provider.getTransaction(txHash);
    
    // Check if transaction was sent to our contract
    if (tx.to.toLowerCase() !== process.env.NEXT_PUBLIC_CONTRACT_ADDRESS.toLowerCase()) {
      return NextResponse.json(
        { error: 'Transaction not sent to correct contract' },
        { status: 400 }
      );
    }

    // 4. Parse transaction data to verify contentId
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      CONTRACT_ABI,
      provider
    );
    
    const decodedData = contract.interface.decodeFunctionData(
      'buyAccess',
      tx.data
    );
    
    if (decodedData._contentId.toString() !== contentId.toString()) {
      return NextResponse.json(
        { error: 'Transaction content ID mismatch' },
        { status: 400 }
      );
    }

    // 5. Record access in database
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Check if access already exists
      const existingAccess = await client.query(
        'SELECT 1 FROM content_access WHERE content_id = $1 AND user_address = $2',
        [contentId, userAddress]
      );
      
      if (existingAccess.rows.length > 0) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { error: 'Access already granted' },
          { status: 400 }
        );
      }

      // Record new access
      await client.query(
        'INSERT INTO content_access (content_id, user_address, tx_hash) VALUES ($1, $2, $3)',
        [contentId, userAddress, txHash]
      );

      await client.query('COMMIT');
    } catch (dbError) {
      await client.query('ROLLBACK');
      throw dbError;
    } finally {
      client.release();
    }

    return NextResponse.json(
      { success: true, contentId, userAddress },
      { status: 200 }
    );

  } catch (error) {
    console.error('Backend processing error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Add other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}