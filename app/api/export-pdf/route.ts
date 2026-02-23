import { buildPdfHtml } from "@/utils/buildPdfHtml";
import { DEFAULT_PDF_LAYOUT, PDFLayoutConfig } from "@/types/PDFLayout";
import { Program } from "@/types/Workout";
import { NextRequest, NextResponse } from "next/server";

// Vercel serverless — allow up to 60 s for large programs
export const maxDuration = 60;

async function getBrowser() {
  // In production (Vercel), use @sparticuz/chromium. Locally, use system Chrome.
  if (process.env.NODE_ENV === "production" || process.env.USE_CHROMIUM) {
    const chromium = (await import("@sparticuz/chromium")).default;
    const puppeteer = (await import("puppeteer-core")).default;
    return puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 794, height: 1123 },
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }

  // Local development — use puppeteer-core with a local Chrome/Chromium
  const puppeteer = (await import("puppeteer-core")).default;

  // Common Chrome paths per platform
  const executablePath =
    process.platform === "win32"
      ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
      : process.platform === "darwin"
        ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        : "/usr/bin/google-chrome";

  return puppeteer.launch({
    executablePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
}

export async function POST(req: NextRequest) {
  let browser;
  try {
    const body = await req.json();

    // Support both new { program, config } payload and legacy program-only payload
    let program: Program;
    let config: PDFLayoutConfig;

    if (body.program) {
      program = body.program;
      config = body.config ?? DEFAULT_PDF_LAYOUT;
    } else {
      program = body;
      config = DEFAULT_PDF_LAYOUT;
    }

    // 1. Build the full HTML document string (pure function, no React)
    const fullHtml = buildPdfHtml(program, config);

    // 2. Launch headless Chrome and print to PDF
    browser = await getBrowser();
    const page = await browser.newPage();

    await page.setContent(fullHtml, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: config.showPageNumbers
        ? { top: "0", right: "0", bottom: "40px", left: "0" }
        : { top: "0", right: "0", bottom: "0", left: "0" },
      ...(config.showPageNumbers && {
        displayHeaderFooter: true,
        headerTemplate: "<span></span>",
        footerTemplate: `
          <div style="width:100%;text-align:center;font-size:9px;color:#9ca3af;font-family:Inter,Helvetica,Arial,sans-serif;padding:8px 0;">
            <span class="pageNumber"></span> / <span class="totalPages"></span>
          </div>`,
      }),
    });

    return new NextResponse(Buffer.from(pdfBuffer), {
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
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
