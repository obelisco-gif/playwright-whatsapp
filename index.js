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

        fs.mkdirSync("/app/output", { recursive: true });

        browser = await chromium.launch({
            headless: no,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage"
            ]
        });

        const context = await browser.newContext({

            viewport: {
                width: 1600,
                height: 900
            },

            locale: "es-ES",

            userAgent:
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"

        });

        const page = await context.newPage();

        await page.goto("https://web.whatsapp.com", {
            waitUntil: "networkidle",
            timeout: 60000
        });

        await page.waitForTimeout(8000);

        const title = await page.title();

        await page.screenshot({
            path: "/app/output/whatsapp.png",
            fullPage: true
        });

        const exists = fs.existsSync("/app/output/whatsapp.png");

        await browser.close();

        res.json({
            ok: true,
            screenshotCreated: exists,
            screenshotUrl: "/output/whatsapp.png",
            title,
            url: page.url()
        });

    } catch (err) {

        if (browser) {
            await browser.close();
        }

        res.status(500).json({
            ok: false,
            error: err.message,
            stack: err.stack
        });

    }

});

app.listen(3000, () => {
    console.log("Playwright API iniciada");
});
