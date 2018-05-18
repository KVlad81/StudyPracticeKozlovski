const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const Posts = require('./public/scripts/index.js');

const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());


app.post('/getPhotoPosts', (req, res)=>{
	const configs = req.query;
	const posts = Posts.getPhotoPosts(Number(configs.skip), Number(configs.top), req.body);
	if(posts){
		res.status(200).send(JSON.stringify(posts));
	}
	else{
		res.status(400).send('Not found');
	}
})

app.post('/addPhotoPost', (req, res) => {
	const post = req.body;

	post.createdAt = new Date(post.createdAt);

	if (Posts.addPhotoPost(post)) {
		res.status(200).send('Success');
	}

	else {
		res.send("Not valid post");
	}
})


app.get('/getPhotoPost', (req, res) => {
	const post = Posts.getPhotoPost(String(req.query.id));

	if (post) {
		res.status(200).send(JSON.stringify(post));
	}
	else {
		res.status(400).send("Not found");
	}
})


app.put('/editPhotoPost', (req, res) => {
	const editPost = req.body;
	const id = String(req.query.id);
    
	if (Posts.editPhotoPost(id, editPost)) {
		res.status(200).send("Success");
	}
	else {
		res.status(400).send("Not valid post");
	}
})

app.delete('/removePhotoPost', (req, res)=>{
	const id = String(req.query.id);

	if(Posts.removePhotoPost(id)){
		res.status(200).send("Success");
	}
	else{
		res.status(400).send("Bad request");
	}
})




const server = app.listen(3000, () => {
	console.log(`Server on port ${port}`);
}); 