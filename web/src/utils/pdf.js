export async function convertElementToPDF(element, filename = "document.pdf") {
    if (!element) return;
    const config = {
        margin: 10,
        filename: filename,
        image: { type: "jpeg", quality: 1 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            logging: false,
        },
        jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
        },
    };

    const {default: html2pdf} = await import("html2pdf.js");

    return html2pdf().set(config).from(element).save();
}
