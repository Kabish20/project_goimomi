export const getImageUrl = (url) => {
    if (!url) return "";
    if (typeof url !== "string") return url;

    // Specifically handle the dev backend URL being returned in production
    if (url.startsWith("http")) {
        return url
            .replace("http://localhost:8000", "")
            .replace("http://127.0.0.1:8000", "")
            .replace("https://3.27.184.234", "")
            .replace("http://3.27.184.234", "")
            .replace("https://www.goimomi.com", "")
            .replace("http://www.goimomi.com", "");
    }
    return url;
};
