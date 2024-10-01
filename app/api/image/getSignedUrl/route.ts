const { Storage } = require("@google-cloud/storage");
import { NextRequest, NextResponse } from "next/server";

const storage = new Storage({
  projectId: "build-your-body-427422",
  credentials: {
    client_email: process.env.GOOGLE_CLOUD_SERVICE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_CLOUD_SERVICE_PRIVATE_KEY,
  },
});

console.log("check11111", process.env.GOOGLE_CLOUD_SERVICE_CLIENT_EMAIL);
console.log("check2222", process.env.GOOGLE_CLOUD_SERVICE_PRIVATE_KEY);

const bucketName = "program-complete-image";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") return;

  const { searchParams } = new URL(req.url);

  const imageName = searchParams.get("imageName");

  if (!imageName) {
    return NextResponse.json(
      { error: "Missing imageName" },
      {
        status: 400,
      }
    );
  }

  try {
    const options = {
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };

    console.log("storage?", storage);

    const [signedUrl] = await storage
      .bucket(bucketName)
      .file(imageName)
      .getSignedUrl(options);

    console.log("signedUrl?", signedUrl);

    const completedUrl = `https://storage.googleapis.com/${bucketName}/${encodeURIComponent(
      imageName
    )}`;

    return NextResponse.json(
      {
        signedUrl,
        completedUrl,
      },
      {
        status: 200,
        statusText: "signed URL created successfully",
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to generate signed URL",
      },
      {
        status: 500,
      }
    );
  }
}
