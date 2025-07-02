import { NextRequest, NextResponse } from 'next/server';
import { PdfReader } from 'pdfreader';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise<NextResponse>((resolve) => {
    let fullText = '';
    
    new PdfReader().parseBuffer(buffer, (err, item) => {
      if (err) {
        console.error("PDF parsing error:", err);
        resolve(NextResponse.json({ error: "PDF parsing error" }, { status: 500 }));
      } else if (!item) {
        // end of file
        console.log(fullText);
        resolve(NextResponse.json({ text: fullText }));
      } else if (item.text) {
        fullText += item.text + ' ';
      }
    });
  });
}
