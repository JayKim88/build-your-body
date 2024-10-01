const { Storage } = require("@google-cloud/storage");
import { NextRequest, NextResponse } from "next/server";

const storage = new Storage({
  projectId: "build-your-body-427422",
  credentials: {
    client_email: process.env.GOOGLE_CLOUD_SERVICE_CLIENT_EMAIL,
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC0X+p4WokFqCPO\nookjUPlSNHtOc/cNoB4GzRiZpbjkeP4ThJO6gJhlV1UdzCrbSkZvo70iu/AdSf12\n8yokxtGQpg716uQff5JZIGLbn1KAiKqIyvPSdU9cWZ9sjGcxQhkM8WaRJ8k8X6vc\nMwclIjcBBTZZmIZzuMo6qtp3mcHT2zDShqXcQ3RS4yYlE2zve7F+fkkdz2iSGVNz\n4Ou4ItRN9dE7S+htSx9r/M2Z6NeZlWjSEjshpegIgKYlRlrAk0VpbU0tvwz5YFHm\nYAGBodpZDDWnht4cO4b7iwHg3YlMcgoWuKNbqOh47lsEAVLf/oH+MNKz+hJxvquX\nSCtyjrTFAgMBAAECggEABbDPiga0G/vCwoi28i5LGCB818kpjpPDu9ePkU82/4/D\nHRBYRHOC5vs8jyHsxsK6l53/N2oMUr1TlXgMUWy3SJsux9TgllUWkmCMpp+4LM6u\npCC9PaF6NgqVFn4r3XcR156xvPtd0CNDHeR1hIWsL048+XU1t0PYI1GzhbPpPTaI\n6EslC+Ry8eEwoeA1GL0NTR3k26HKYrAZyuvk8YTVMa/7O1j5GpgiSoBN/jkmRZMH\nAEwLaqr+aIxBMJGA1OhENXVsit8AqU4ElLegBjJeabFW3i73D71j9FhjygIK9PdM\nTT5kvPsA4oJJlsCS3KjxjIN4o8epYmBH515bVPvlYQKBgQD0j9Xh8ZFiBST3yfsC\nCuZ7qJgZC9ggmYU7+H8qnhlT096EYxv4WFa3FhaqCJ5G+tauATRjltHS/Mq3cCNM\n8v1VPryo/g7V35Ng5QN32jOKDieAFecmVcgQvKJ8dKM+HJEREdt68EcsJQ4UOH7S\nE+f0YWNOTDuSuAlnbSR3Bcxr5wKBgQC8z4+B8UOMnNTU68jxwRvkKmqrsbG9vJIB\nljtSTjlLn4ohNdq+YpnY1imzu6D+F/dAkom6zAnL2az7ngWdn2+16y+JxC9fZzkr\nBCwi6VF38zgzyDCVFn2hQLYrQp/4jscnGbDhUNmrtQC51a/02Ta9vdu8mLESsqiO\nxBAZw0xkcwKBgQDKYgVjVx8yeINhMxqvVAnsJ1bG01BlmeXx/PBveioHfvtTnxjU\naXZJSNQ0nbEtmAL0ODb8eyDkcyHmr7vmv+b5FlPVnXj1cHFr69j04/NmudPiYT3K\nMY7Amvnz+CnnCojaEWcJ07FyTK/b9+yrOKHpUHZ3owphnj7aAi38+SVz3QKBgQCY\neRVu3iKqnsvQ1kgD0upvK0HRPUJH8swFtAhbwwfJ5iBqCU+Ih5+t1+T9W/v6tefZ\noXzP+I3ArRxgZZArZeGUi0RsgJ2w8W7dKhVqa/h6YVN1nah9/Ree7N8vuDHvS33Q\nOZL5oYzmeNkJOWNK2061k2iruLLmYph0EijeZTR/uQKBgHL+awx3581bRapbHTuq\nWpLNMVEivWrOeZzOjcpDg1hM9c7eZpnil3g6U79hLF6Ri5G95/LDD8U/9CaUu7IR\nEUNDERQp2eUxTQFEovPkeQJlaMw2nSHzpSRvY53xAvQpweZgGhhJKyQ8b9VFoFFp\n49lZTc9yxjLxSL9zHUN9XaV7\n-----END PRIVATE KEY-----\n",
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
