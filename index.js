const express = require("express");
const { chromium } = require("playwright");
const fs = require("fs");

const app = express();

// Servir archivos estáticos
app.use("/output", express.static("/app/output"));

app.get("/", (req, res) => {
    res.send("Playwright API");
});

app.get("/login", async (req, res) => {
    let browser;

    try {

        browser = await chromium.launch({
            headless: true
        });

        const page = await browser.newPage({
            viewport: {
                width: 1400,
                height: 900
            }
        });

        await page.goto("https://web.whatsapp.com", {
            waitUntil: "networkidle",
            timeout: 60000
        });

        await page.waitForTimeout(5000);

        // Crear carpeta si no existe
        fs.mkdirSync("/app/output", { recursive: true });

        // Guardar captura
        await page.screenshot({
            path: "/app/output/whatsapp.png",
            fullPage: true
        });

        res.json({
            ok: true,
            screenshot: "/output/whatsapp.png",
            url: page.url(),
            title: await page.title()
        });

    } catch (err) {

        res.status(500).json({
            ok: false,
            error: err.message
        });

    } finally {

        if (browser) {
            await browser.close();
        }

    }
});

app.listen(3000, () => {
    console.log("Playwright API iniciada");
});
