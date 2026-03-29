import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink, readFile } from "fs/promises";
import { join } from "path";
import * as os from "os";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
    const rateLimited = rateLimit(req);
    if (rateLimited) return rateLimited;

    let inputFilePath = "";

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const MAX_SIZE = 50 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: "File too large. Maximum 50MB." }, { status: 400 });
        }
        if (file.type !== 'application/pdf') {
            return NextResponse.json({ error: "Only PDF files are accepted." }, { status: 400 });
        }

        const clientId = process.env.ADOBE_CLIENT_ID;
        const clientSecret = process.env.ADOBE_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        // 1. Get Adobe Access Token
        const tokenParams = new URLSearchParams();
        tokenParams.append('client_id', clientId);
        tokenParams.append('client_secret', clientSecret);

        const tokenRes = await fetch('https://pdf-services-ue1.adobe.io/token', {
            method: 'POST',
            body: tokenParams,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        if (!tokenRes.ok) throw new Error("Failed to authenticate with Adobe Services");
        const { access_token } = await tokenRes.json();
        const authHeader = `Bearer ${access_token}`;

        // 2. Save file temporarily
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 100);
        const tempDir = os.tmpdir();
        inputFilePath = join(tempDir, `input_${Date.now()}_${sanitizedName}`);
        await writeFile(inputFilePath, Buffer.from(await file.arrayBuffer()));

        // 3. Get upload URI
        const assetRes = await fetch('https://pdf-services.adobe.io/assets', {
            method: 'POST',
            body: JSON.stringify({ mediaType: 'application/pdf' }),
            headers: { 'Authorization': authHeader, 'x-api-key': clientId, 'Content-Type': 'application/json' }
        });
        if (!assetRes.ok) throw new Error("Failed to initialize Adobe upload");
        const { uploadUri, assetID } = await assetRes.json();

        // 4. Upload file
        await fetch(uploadUri, {
            method: 'PUT',
            body: await readFile(inputFilePath),
            headers: { 'Content-Type': 'application/pdf' }
        });

        // 5. Start export job (PDF → XLSX)
        const jobRes = await fetch('https://pdf-services.adobe.io/operation/exportpdf', {
            method: 'POST',
            body: JSON.stringify({ assetID, targetFormat: 'xlsx' }),
            headers: { 'Authorization': authHeader, 'x-api-key': clientId, 'Content-Type': 'application/json' }
        });
        if (!jobRes.ok) throw new Error("Failed to start conversion job");
        const jobLocation = jobRes.headers.get('location');
        if (!jobLocation) throw new Error("No polling location returned");

        // 6. Poll for completion
        let downloadUri = "";
        for (let i = 0; i < 20; i++) {
            await new Promise(r => setTimeout(r, 2000));
            const pollRes = await fetch(jobLocation, {
                headers: { 'Authorization': authHeader, 'x-api-key': clientId }
            });
            const pollData = await pollRes.json();
            if (pollData.status === 'done') { downloadUri = pollData.asset.downloadUri; break; }
            if (pollData.status === 'failed') throw new Error("Adobe conversion failed");
        }
        if (!downloadUri) throw new Error("Conversion timed out");

        // 7. Download and return result
        const downloadRes = await fetch(downloadUri);
        const outputBuffer = await downloadRes.arrayBuffer();

        return new NextResponse(outputBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="${sanitizedName.replace(/\.pdf$/i, '')}.xlsx"`,
            }
        });

    } catch (error: any) {
        console.error("Adobe PDF→XLSX Error:", error);
        return NextResponse.json({ error: "Failed to convert document. Please try again." }, { status: 500 });
    } finally {
        if (inputFilePath) await unlink(inputFilePath).catch(() => { });
    }
}
