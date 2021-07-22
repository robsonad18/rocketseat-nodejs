const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const pdf = require('html-pdf');
const puppeteer = require('puppeteer');

const passengers = [
	{
		name: 'Robson',
		flightNumber: 66545,
		time:'23h00'
	},
	{
		name: 'Lucas',
		flightNumber: 4343,
		time: '18h00'
	},
	{
		name: 'Farias',
		flightNumber: 54232,
		time: '15h00'
	}
];

app.get('/', (request, response) => {
	const filePath = path.join(__dirname, 'print.ejs');

	ejs.renderFile(filePath, { passengers: passengers}, (err, html) => {
			if (err) {
				return response.send('Erro na leitura do arquivo');
			}
			const options = {
				height: "11.25in",
				width: "8.5in",
				header: {
					height: "20mn",
				},
				footer: {
					height: "20mn"
				}
			};

			// cria pdf
			pdf.create(html, options).toFile('report.pdf', (err, data) => {
				if (err) {
					return response.send('Erro ao gerar o pdf');
				}
				// enviar para o navegador
				return response.send(html);
			}); 

		}
	);
});

app.get('/pdf', async(request, response) => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto('http://localhost:5001', {
		waitUntil:'networkidle0'
	});

	const pdf = await page.pdf({
		printBackground: true,
		format: 'letter',
		margin: {
			top:'20px',
			bottom:'40px',
			left:'20px',
			right:'20px'
		}
	});

	await browser.close();

	response.contentType('application/pdf');

	return response.send(pdf);
});

app.get('/puppeteer', (request, response) => {
	return response.send('Nova rota');
});


app.listen(5001);
