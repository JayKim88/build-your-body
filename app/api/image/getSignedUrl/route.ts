const { Storage } = require("@google-cloud/storage");
import { NextRequest, NextResponse } from "next/server";
import path from "path";

const storage = new Storage({
  projectId: "build-your-body-427422",
  keyFilename: path.join(process.cwd(), "/service-account-key.json"),
});

const bucketName = "program-complete-image";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const fileName = searchParams.get("fileName");

  if (!fileName) {
    return NextResponse.json(
      { error: "Missing fileName" },
      {
        status: 400,
      }
    );
  }

  try {
    const options = {
      version: "v4",
      action: "read",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };

    const [url] = await storage
      .bucket(bucketName)
      .file(fileName + new Date().toISOString())
      .getSignedUrl(options);

    return NextResponse.json(
      {
        url,
      },
      {
        status: 200,
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
