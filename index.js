const express = require("express");
const { chromium } = require("playwright");

const app = express();

app.get("/", (req, res) => {
    res.send("Playwright API");
});

app.get("/test", async (req, res) => {
    let browser;

    try {
        browser = await chromium.launch({
            headless: true
        });

        const page = await browser.newPage({
            viewport: {
                width: 1280,
                height: 720
            }
        });

        await page.goto("https://web.whatsapp.com", {
            waitUntil: "networkidle",
            timeout: 60000
        });

        await page.waitForTimeout(5000);

        const result = {
            ok: true,
            url: page.url(),
            title: await page.title(),
            htmlLength: (await page.content()).length,
            htmlPreview: (await page.content()).substring(0, 500)
        };

        res.json(result);

    } catch (err) {

        res.status(500).json({
            ok: false,
            error: err.message,
            stack: err.stack
        });

    } finally {

        if (browser) {
            await browser.close();
        }

    }
});

app.listen(3000, () => {
    console.log("🚀 Playwright API iniciada en puerto 3000");
});
