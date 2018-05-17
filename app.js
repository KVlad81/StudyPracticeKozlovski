const express = require('express');
const port = 3000;
const app = express();
app.use(express.static('./public'));

const server = app.listen(3000, () => {
	console.log(`Server on port ${port}`);
}); 