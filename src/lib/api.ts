import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
    baseURL: `${API_BASE}/api/v1`,
    timeout: 60000,
});

export async function postFormData(
    endpoint: string,
    formData: FormData,
    onProgress?: (pct: number) => void
): Promise<Blob> {
    try {
        const res = await api.post(endpoint, formData, {
            responseType: "blob",
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (e) => {
                if (e.total && onProgress) {
                    onProgress(Math.round((e.loaded * 100) / e.total));
                }
            },
        });
        return res.data;
    } catch (err: any) {
        if (err.response?.data instanceof Blob) {
            try {
                const text = await err.response.data.text();
                const json = JSON.parse(text);
                throw new Error(json.detail || "Request failed.");
            } catch (parseErr) {
                if (parseErr instanceof Error && parseErr.message !== "Request failed.") {
                    // JSON parsing failed, but we might have a message from above
                    if ((parseErr as any).message) throw parseErr;
                }
                throw parseErr;
            }
        }
        throw err;
    }
}

export function downloadFromUrl(url: string, filename: string) {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

export function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    downloadFromUrl(url, filename);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default api;
