import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink, readFile } from "fs/promises";
import { join } from "path";
import * as os from "os";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
    const rateLimited = rateLimit(req);
    if (rateLimited) return rateLimited;

    let inputFilePath = "";
    let outputFilePath = "";

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
            console.error("Missing Adobe Credentials");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        // 1. Get Access Token from Adobe
        const tokenParams = new URLSearchParams();
        tokenParams.append('client_id', clientId);
        tokenParams.append('client_secret', clientSecret);

        const tokenRes = await fetch('https://pdf-services-ue1.adobe.io/token', {
            method: 'POST',
            body: tokenParams,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        if (!tokenRes.ok) {
            const err = await tokenRes.text();
            console.error("Adobe Token Error:", err);
            throw new Error("Failed to authenticate with Adobe Services");
        }

        const { access_token } = await tokenRes.json();
        const authHeader = `Bearer ${access_token}`;

        // Create temporary file paths
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 100);
        const tempDir = process.env.TEMP || process.env.TMPDIR || os.tmpdir() || '/tmp';
        inputFilePath = join(tempDir, `input_${Date.now()}_${sanitizedName}`);
        outputFilePath = join(tempDir, `output_${Date.now()}_adobe.docx`);

        // Save uploaded file temporarily
        const arrayBuffer = await file.arrayBuffer();
        await writeFile(inputFilePath, Buffer.from(arrayBuffer));

        // 2. Get Upload URI
        const assetRes = await fetch('https://pdf-services.adobe.io/assets', {
            method: 'POST',
            body: JSON.stringify({ mediaType: 'application/pdf' }),
            headers: {
                'Authorization': authHeader,
                'x-api-key': clientId,
                'Content-Type': 'application/json'
            }
        });

        if (!assetRes.ok) throw new Error("Failed to initialize Adobe upload");
        const { uploadUri, assetID } = await assetRes.json();

        // 3. Upload File
        const fileData = await readFile(inputFilePath);
        const uploadFileRes = await fetch(uploadUri, {
            method: 'PUT',
            body: fileData,
            headers: { 'Content-Type': 'application/pdf' }
        });

        if (!uploadFileRes.ok) throw new Error("Failed to upload file to Adobe");

        // 4. Start PDF to Word Job
        const jobRes = await fetch('https://pdf-services.adobe.io/operation/exportpdf', {
            method: 'POST',
            body: JSON.stringify({ assetID: assetID, targetFormat: 'docx' }),
            headers: {
                'Authorization': authHeader,
                'x-api-key': clientId,
                'Content-Type': 'application/json'
            }
        });

        if (!jobRes.ok) throw new Error("Failed to start formatting job");
        const jobLocation = jobRes.headers.get('location');
        if (!jobLocation) throw new Error("No polling location returned");

        // 5. Poll for completion
        let downloadUri = "";
        let isDone = false;

        for (let i = 0; i < 20; i++) { // Max 40 seconds
            await new Promise(r => setTimeout(r, 2000));
            const pollRes = await fetch(jobLocation, {
                headers: { 'Authorization': authHeader, 'x-api-key': clientId }
            });
            const pollData = await pollRes.json();

            if (pollData.status === 'done') {
                isDone = true;
                downloadUri = pollData.asset.downloadUri;
                break;
            } else if (pollData.status === 'failed') {
                console.error("Adobe Job Failed", pollData);
                throw new Error("Adobe rejected the conversion job");
            }
        }

        if (!isDone || !downloadUri) throw new Error("Conversion timed out");

        // 6. Download the result
        const downloadRes = await fetch(downloadUri);
        const outputBuffer = await downloadRes.arrayBuffer();

        // 7. Return to client
        const safeOutputName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/\.pdf$/i, '').substring(0, 80);
        return new NextResponse(outputBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition': `attachment; filename="${safeOutputName}.docx"`,
            }
        });

    } catch (error: any) {
        console.error("Adobe API Error:", error);
        return NextResponse.json(
            { error: "Failed to process document. Please try again." },
            { status: 500 }
        );
    } finally {
        if (inputFilePath) await unlink(inputFilePath).catch(() => { });
        if (outputFilePath) await unlink(outputFilePath).catch(() => { });
    }
}
