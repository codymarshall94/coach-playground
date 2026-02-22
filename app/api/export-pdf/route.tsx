import { ProgramPDF } from "@/components/ProgramPDF";
import { PDFLayoutConfig } from "@/types/PDFLayout";
import { Program } from "@/types/Workout";
import { renderToBuffer } from "@react-pdf/renderer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Support both new { program, config } payload and legacy program-only payload
    let program: Program;
    let config: PDFLayoutConfig | undefined;

    if (body.program) {
      program = body.program;
      config = body.config;
    } else {
      // Legacy: body IS the program
      program = body;
    }

    const buffer = await renderToBuffer(
      <ProgramPDF program={program} config={config} />
    );

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
