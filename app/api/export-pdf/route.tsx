import { ProgramPDF } from "@/components/ProgramPDF";
import { Program } from "@/types/Workout";
import { renderToBuffer } from "@react-pdf/renderer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const program: Program = await req.json();

    const buffer = await renderToBuffer(<ProgramPDF program={program} />);

    return new NextResponse(Buffer.from(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(program.name)}.pdf"`,
      },
    });
  } catch (err) {
    console.error("[export-pdf] error:", err);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
