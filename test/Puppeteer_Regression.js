const puppeteer = require('puppeteer');
var expect = require('chai').expect;
const dotev = require('dotenv').config();
var util = require('util')
async function test() {
	
	setTimeout(function(){console.log('execute')},2000);
	
}
(async () => {
  const browser = await puppeteer.launch();
  await test();
  console.log('1');
  const page = await browser.newPage();
  console.log("2");
  await page.goto('http://localhost:8080');
  console.log("3");
  await page.screenshot({path: 'test/screenshots/home.png'});
  console.log("4");
  //expect(await domText.$$eval('#DisplayResponse',node => node.innerText)).to.equal("Is it like Darks souls lets find out lol");
  await logIntoLearn(page,browser);
  
  await createCourse(page);
  
  await goBack();
  
  
  
  await browser.close();
  
  
})();

async function goBack(page){
	
	page.goBack();
	
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
	console.log(email);
	console.log(password);
	
	page.$eval('#exampleInputEmail1',el => el.value = 'mikez@email.com');
	page.$eval('#exampleInputPassword1',(el,password) => el.value = password,password);
	/*
	try {
		page.$eval('#exampleInputEmail1', (email,page) => page.$('#exampleInputEmail1').value = email,email,page);
		page.$eval('#exampleInputPassword1',(password,page) => page.$('#exampleInputPassword1').value = password,password,page);
	}	
	catch(ex){
		console.log('inputs');
		console.log(ex);
	}	
	*/
	try{
		const navPromise = page.waitForNavigation();
		await page.$eval('#loginForm',form => form.submit());
		await navPromise;
		await page.screenshot({path: 'test/screenshots/landing.png'});
		await page.$('#welcomeHeader');
	}
	catch(ex){
		console.log('form sub');
		console.log(ex);
		
	}
}



