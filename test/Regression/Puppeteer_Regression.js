const puppeteer = require('puppeteer');
var expect = require('chai').expect;
const dotev = require('dotenv').config();
var assert = require('assert');
(async () => {
  const browser = await puppeteer.launch({args : ['--no-sandbox']});
 
  console.log('1');
  const page = await browser.newPage();
  console.log("2");
  await page.goto('http://localhost:8081');
  await page.waitFor(3000);
  console.log("3");
  await page.screenshot({path: 'test/screenshots/home.png'});
  console.log("4");
  await logIntoLearn(page,browser);
  
  await createCourse(page);
  
  await goBack(page,browser);
  
 
})();

async function goBack(page,browser){
	
	await page.goBack();
	await browser.close();
	
}
async function createCourse(page){
	
	const navPromise = page.waitForNavigation();
	await page.click('#navbarSupportedContent > ul > li:nth-child(3) > a');
	await navPromise;
	await page.screenshot({path: 'test/screenshots/createCourse.png'});
	
}

async function logIntoLearn(page,browser){
	var email = process.env.TEST_EMAIL;
	var password = process.env.TEST_PASSWORD;
		
	await page.waitFor(4000);	
		
	await page.$eval('#exampleInputEmail1',el => el.value = 'mikez@email.com');
	await page.$eval('#exampleInputPassword1',(el,password) => el.value = password,password);
	try{
		const navPromise = page.waitForNavigation();
		await page.$eval('#loginForm',form => form.submit());
		await navPromise;
		await page.screenshot({path: 'test/screenshots/landing.png'});
		expect((await page.$eval('#welcomeHeader',el => el.innerText))).to.equal("Welcome To LearnLive Mike !");
		expect((await page.$eval('#coursesEnrolled',el => el.hasChildNodes()))).to.equal(true);
		expect((await page.$eval('#newCourses',el => el.hasChildNodes()))).to.equal(true);
		expect((await page.$eval('#instructorCourses',el => el.hasChildNodes()))).to.equal(true);
		
	}
	catch(ex){
		console.log('form sub');
		console.log(ex);
		process.exit(1);
		
	}
}



