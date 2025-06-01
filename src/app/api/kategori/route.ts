// import { NextResponse } from "next/server";
// import { promises as fs } from "fs";
// import path from "path";

// export async function GET() {
//   try {
//     const filePath = path.join(process.cwd(), "public", "data", "kategori.csv");
//     const fileContent = await fs.readFile(filePath, "utf-8");

//     const lines = fileContent.trim().split("\n");
//     const result = lines.slice(1).map((line) => {
//       const [id, nama] = line.split(",");
//       return { id, nama };
//     });

//     return NextResponse.json(result);
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Gagal membaca file kategori" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sheetId = "15yszmsC49K-3ESxNXjXcWho4JMXT-EIgkfcQS19FLHA";
    const gid = "0";
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&id=${sheetId}&gid=${gid}`;

    const res = await fetch(url);
    const text = await res.text();

    const lines = text.trim().split("\n");
    const result = lines.slice(1).map((line) => {
      const [id, nama] = line.split(",");
      return { id, nama };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal membaca data dari Google Sheets" },
      { status: 500 }
    );
  }
}
