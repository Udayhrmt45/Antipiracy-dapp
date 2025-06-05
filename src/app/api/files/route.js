import { NextResponse } from "next/server";
import { pinata } from "../../../../utils/config";
import { group } from "../../../../utils/config";
import pool from "../../../../utils/db";

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get("file"); // Get the file from the form data
    const creatorAddress = data.get("creatorAddress"); // Passed from frontend
    const uploadData = await pinata.upload.file(file); // Upload the file to Pinata
    const priceEth = data.get('priceEth'); // Get the price from the form data
    // const uploadData = await pinata.upload.public.file(file);

    if (!creatorAddress || !priceEth) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
      });
    }

    // const url = await pinata.gateways.createSignedURL({
    //   cid: uploadData.cid, 
    //   expires: 3600, 
    // });

  
    const ifpsHash = uploadData.cid;
    // return NextResponse.json({ url, ifpsHash }, { status: 200 });
    
    // console.log(uploadData.cid);
    // console.log(url);
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO content (content_id, ipfs_hash, creator_address, price_eth) VALUES ($1, $2, $3, $4) RETURNING content_id',
      [Math.floor(Math.random() * 1000000), ifpsHash, creatorAddress, priceEth] // Replace with actual contentId logic
    );
    client.release();

    
    return NextResponse.json(
      { cidNo: result.rows[0].content_id,ifpsHash,contentId : ifpsHash},
      { status: 200 }
    );
  } catch (e) {
    console.log(e); // Log the error for debugging
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}