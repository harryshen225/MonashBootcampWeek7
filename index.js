const fs = require("fs");
const axios = require("axios");
const util = require("util");
const inquirer = require("inquirer");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

async function generateResume(){
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
                "orange",
                "purple",
                "green",
                "red",
                "amber",
                "navy blue",
                "space grey"
            ]
        }
    ])
    console.log(`{${gitUserName},${backgroundColor}}`);
}


generateResume();
