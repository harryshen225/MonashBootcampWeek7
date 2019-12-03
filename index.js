const fs = require("fs");
const axios = require("axios");
const util = require("util");
const inquirer = require("inquirer");
const generateHTML = require("./generateHTML.js");
const puppeteer = require("puppeteer");

const writeFileAsync = util.promisify(fs.writeFile);

async function write2PDF(html, outputFile){

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html,{waitUntil:"networkidle0"});
    await page.pdf({
        path:outputFile,
        format: `A4`,
        printBackground:true
    });
    await browser.close();
    process.exit();
}

 
async function generateResume(){
    try{
        const { gitUserName, backgroundColor }= await inquirer.prompt([
            {
                type:"input",
                name:"gitUserName",
                location:"Please input your GitHub Username"
            },
            {
                type:"list",
                name: "backgroundColor",
                message: "Please choose your background color",
                choices:[
                    "blue",
                    "green",
                    "pink",
                    "red"
                ]
            }
        ])
        const userQueryUrl = `https://api.github.com/users/${gitUserName}`;
        const repoQueryUrl = `https://api.github.com/users/${gitUserName}/repos`;
        const userResponse = await axios.get(userQueryUrl);
        const repoResponse = await axios.get(repoQueryUrl);
        const starArray = repoResponse.data.map(repo => parseInt(repo.watchers));
        const locationURI = encodeURI(`https://www.google.com/maps/place/${userResponse.data.location}`)
        const totalStars = starArray.reduce((a,b)=> a+b,0);
        const resultHTML = generateHTML.generateHTMLHead(backgroundColor)+generateHTML.generateHTMLBody(userResponse.data,totalStars, locationURI);
        await writeFileAsync(`${gitUserName}.html`, resultHTML);
        const pdfRes = await write2PDF(resultHTML,`${gitUserName}.pdf`);
    }catch(err){
        console.log(err);
    }
}

generateResume();
