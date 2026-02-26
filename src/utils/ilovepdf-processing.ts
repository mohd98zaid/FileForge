import axios from 'axios';

const PUBLIC_KEY = process.env.NEXT_PUBLIC_ILOVEPDF_PUBLIC_KEY;

// Helper to get auth token
async function getAuthToken(): Promise<string> {
    try {
        const response = await axios.get('/api/ilovepdf/auth');
        if (response.data.token) {
            return response.data.token;
        }
        throw new Error('No token received');
    } catch (error: any) {
        console.error('Failed to get iLovePDF auth token', error);
        throw error;
    }
}

// Raw API implementation for tools not supported by SDK or where SDK tool names differ
async function processWithRawApi(
    file: File,
    tool: string,
    params: any = {}
): Promise<File> {
    const token = await getAuthToken();
    const authHeaders = { Authorization: `Bearer ${token}` };

    if (!PUBLIC_KEY) throw new Error('Missing iLovePDF Public Key');

    try {
        // 1. Start Task
        const startRes = await axios.get(`https://api.ilovepdf.com/v1/start/${tool}`, {
            headers: authHeaders,
            params: { public_key: PUBLIC_KEY }
        });
        const { server, task } = startRes.data;
        if (!task) throw new Error("No task ID received from start endpoint");

        // 2. Upload File
        const fd = new FormData();
        fd.append('task', task);
        fd.append('file', file);

        const uploadRes = await axios.post(`https://${server}/v1/upload`, fd, {
            headers: { ...authHeaders, 'Content-Type': 'multipart/form-data' },
            params: { public_key: PUBLIC_KEY }
        });
        const serverFilename = uploadRes.data.server_filename;

        // 3. Process
        const processBody = {
            task,
            tool,
            files: [{ server_filename: serverFilename, filename: file.name }],
            ...params
        };
        console.log("iLovePDF Process Body:", JSON.stringify(processBody, null, 2));

        await axios.post(`https://${server}/v1/process`, processBody, {
            headers: authHeaders,
            params: { public_key: PUBLIC_KEY }
        });
        console.log("iLovePDF Process Initiated");

        // 4. Download
        const downloadRes = await axios.get(`https://${server}/v1/download/${task}`, {
            headers: authHeaders,
            params: { public_key: PUBLIC_KEY },
            responseType: 'blob'
        });

        return new File([downloadRes.data], `converted_${file.name.split('.')[0]}.${params?.output_format || 'pdf'}`, {
            type: downloadRes.headers['content-type']
        });

    } catch (error: any) {
        console.error("iLovePDF Raw API Error Debug:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
        });

        // Handle specific API errors
        if (error.response?.status === 400 && error.response?.data?.error?.param === 'tool') {
            throw new Error("This feature (PDF to Word) is not available on your current iLovePDF API plan. Please upgrade to use this tool.");
        }

        const detailedMsg = error.response?.data?.error?.message || error.message || "Unknown error";
        throw new Error(`iLovePDF Failed: ${detailedMsg}`);
    }
}

/**
 * Convert Office (Word, Excel, PPT) to PDF
 * Using Raw API with 'officepdf' tool.
 */
export async function convertOfficeToPdf(file: File): Promise<File> {
    return processWithRawApi(file, 'officepdf');
}

/**
 * Convert PDF to Word
 * Using Raw API with 'officepdf' tool (handles bidirectional conversion).
 */
export async function convertPdfToWord(file: File): Promise<File> {
    console.log("Starting convertPdfToWord via Adobe PDF Services", { file: file.name, size: file.size });

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/adobe/pdf-to-word", {
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error || "Failed to convert PDF using Adobe Services");
    }

    const blob = await res.blob();
    return new File([blob], `${file.name.replace(/\.[^/.]+$/, "")}.docx`, {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    });
}

// We can add more specific functions as needed.

/**
 * Convert PowerPoint (PPT/PPTX) to PDF via iLovePDF officepdf tool
 */
export async function convertPptToPdf(file: File): Promise<File> {
    return processWithRawApi(file, 'officepdf');
}

/**
 * Convert Excel (XLS/XLSX) to PDF via iLovePDF officepdf tool
 */
export async function convertXlsToPdf(file: File): Promise<File> {
    return processWithRawApi(file, 'officepdf');
}

