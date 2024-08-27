const { Storage } = require("@google-cloud/storage");
import { NextRequest, NextResponse } from "next/server";
import path from "path";

const storage = new Storage({
  projectId: "build-your-body-427422",
  keyFilename: path.join(process.cwd(), "/service-account-key.json"),
});

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

    const [signedUrl] = await storage
      .bucket(bucketName)
      .file(imageName)
      .getSignedUrl(options);

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
