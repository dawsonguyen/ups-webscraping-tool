const puppeteer = require('puppeteer');
const fs = require('fs/promises');

async function tracking(tracking) {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    let message = "";
    
    await page.setViewport({
        width: 1920,
        height: 1080
    });
    await page.goto("https://www.ups.com/track?loc=en_US&requester=QUIC&tracknum=" + tracking + "/trackdetails", {
        timeout: 15000});

    await page.reload();
    await page.waitForTimeout(1000);
    if((await page.$("#st_App_PkgStsMonthNum")) !== null)
    {
        const delivered = await page.$eval("#st_App_PkgStsMonthNum", el => el.textContent);
        message += "Delivered on" + delivered.toString().replace(/\s+/g, " ")
    }
    else if((await page.$("#st_App_PkgStsTimeDayMonthNum")) !== null)
    {
        const inTransit = await page.$eval("#st_App_PkgStsTimeDayMonthNum", el => el.textContent);
        message += "Estimated Delivery: " + inTransit.toString().replace(/\s+/g, " ");
    }
    await Promise.all([
    await page.click("#st_App_View_Details"),
    await page.waitForTimeout(1000),
    await page.click('#tab_1'),
    await page.waitForTimeout(500),
    ])
    const status = await page.$eval("#stApp_activitydetails_row0", el => el.textContent)
    message += "\n" +(status.toString().replace(/\s+/g, " "));
    browser.close();
    printMessage(message)
}

async function printMessage(message){
    console.log(message);
}

tracking("TRACKING_NUMBER_HERE")

