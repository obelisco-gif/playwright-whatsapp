const express = require("express");
const { chromium } = require("playwright");

const app = express();

app.get("/", (req, res) => {
    res.send("Playwright API");
});

app.get("/test", async (req, res) => {

    const browser = await chromium.launch({
        headless: true
    });

    const page = await browser.newPage();

    await page.goto("https://web.whatsapp.com", {
        waitUntil: "networkidle"
    });

    await page.waitForTimeout(5000);

    res.json({
        url: page.url(),
        title: await page.title(),
        html: (await page.content()).substring(0,500)
    });

    await browser.close();

});
app.listen(3000, () => {
    console.log("Servidor iniciadov1");
});
