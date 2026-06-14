import { createFileRoute } from "@tanstack/react-router";
import * as fs from "fs";
import * as path from "path";

async function uploadHandler({ request }: { request: Request }) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return new Response(JSON.stringify({ success: false, error: "No file uploaded" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 1. Try local file write first (works perfectly locally & offline)
    try {
      const ext = path.extname(file.name) || ".png";
      const filename = `upload-${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
      
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, buffer);

      return new Response(JSON.stringify({ success: true, url: `/uploads/${filename}` }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    } catch (localWriteErr) {
      // 2. Local write failed (e.g., read-only filesystem on Vercel) -> proxy upload to tmpfiles.org
      const uploadForm = new FormData();
      uploadForm.append("file", file);

      const res = await fetch("https://tmpfiles.org/api/v1/upload", {
        method: "POST",
        body: uploadForm,
      });

      if (!res.ok) {
        throw new Error(`Proxy upload failed with status ${res.status}`);
      }

      const data = await res.json();
      if (data.status === "success" && data.data?.url) {
        const directUrl = data.data.url.replace("https://tmpfiles.org/", "https://tmpfiles.org/dl/");
        return new Response(JSON.stringify({ success: true, url: directUrl }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      } else {
        throw new Error("Invalid response from proxy host");
      }
    }
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message || String(err) }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}

export const Route = createFileRoute("/api/upload")({
  server: {
    handlers: {
      POST: uploadHandler,
    },
  },
});
