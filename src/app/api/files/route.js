import { NextResponse } from "next/server";
import { pinata } from "../../../../utils/config";

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get("file"); // Get the file from the form data
    const uploadData = await pinata.upload.file(file); // Upload the file to Pinata
    const url = await pinata.gateways.createSignedURL({
      cid: uploadData.cid, 
      expires: 3600, 
    });
    const contentId = uploadData.cid;
    return NextResponse.json({ url, contentId }, { status: 200 });
    // console.log(uploadData.cid);
    // console.log(url);
  } catch (e) {
    console.log(e); // Log the error for debugging
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}