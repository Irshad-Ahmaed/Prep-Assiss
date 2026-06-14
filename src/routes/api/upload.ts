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
    const ext = path.extname(file.name) || ".png";
    const filename = `upload-${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
    
    // Ensure public/uploads directory exists
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
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
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
