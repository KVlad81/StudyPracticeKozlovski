(function () {


	function AJAX(method, url, body) {
		return new Promise((res, rej) => {

			const xhr = new XMLHttpRequest();
			xhr.open(method, url, false);

			xhr.setRequestHeader('Content-type', 'application/json');

			xhr.onreadystatechange = function () {
				if (xhr.readyState !== 4) {
					return;
				}
				if (xhr.status !== 200) {
					console.log(xhr.status + ': ' + xhr.statusText);
				}
				else {
					res(xhr.response);
				}
			}

			xhr.send(JSON.stringify(body));
		})

	}

	class PhotoPostsController {

		constructor() {
			this.currentId = 28;
			this.user = null;
			this.isLogIn = false;
			this.posts = [];
			this.feed = document.getElementsByClassName('feed')[0];
		}

		showPhotoPostsElement(filterConfig) {
			let posts;
			// function callback(response) {
			// 	posts = JSON.parse(response);
			// }

			AJAX('POST', 'getPhotoPosts', filterConfig).then((response) => {
				posts = JSON.parse(response);
				posts.forEach(post => this.feed.appendChild(this.createPhotoPostElement(post)));
				this.setButtonsDisplay();
			});

		}

		addPhotoPost(post) {
			// function callback(response) {
			// 	console.log(response);
			// 	this.reload(0, 10);
			// }
			// callback = callback.bind(this);

			//			console.log(post);
			AJAX('POST', '/addPhotoPost', post)
				.then(() => {
					this.reload(0, 10);
				});
		}


		removePhotoPost(id) {
			// function callback(response) {
			// 	this.reload(0, 10);
			// }
			// callback = callback.bind(this);

			AJAX('DELETE', `/removePhotoPost?id=${id}`)
				.then(() => {
					this.reload(0, 10);
				});

		}

		editPhotoPost(id, post) {
			const posts = Array.from(document.querySelectorAll(".post"));
			// function callback(response) {
			// 	posts.forEach(item => {
			// 		if (item.id === id) {
			// 			for (let key in post) {
			// 				item[key] = post[key];
			// 			}
			// 			this.replaceDomPost(item);
			// 		}
			// 	});
			// }
			// callback = callback.bind(this);

			AJAX('PUT', `/editPhotoPost?id=${id}`, post)
				.then(() => {
					posts.forEach(item => {
						if (item.id === id) {
							for (let key in post) {
								item[key] = post[key];
							}
							this.replaceDomPost(item);
						}
					});
				});


		}

		replaceDomPost(newPost) {
			let post = document.getElementById(newPost.id);
			post.parentNode.replaceChild(this.createPhotoPostElement(newPost), post);
			this.setButtonsDisplay();
		}


		reload(skip, top, filterConfig) {

			this.deleteDomPosts();

			this.showPhotoPostsElement(filterConfig);
		}

		deleteDomPosts() {
			document.querySelector('.feed').innerHTML = '';
		}

		createPhotoPostElement(photoPost) {

			let post = document.createElement('div');
			post.setAttribute('id', photoPost.id);
			post.classList.add('post');

			let time = document.createElement('div');
			time.textContent = photoPost.createdAt.toString().split(' GMT')[0];
			time.classList.add('time');
			post.append(time);

			let img = document.createElement('img');
			img.className = 'post-img';
			img.setAttribute('src', photoPost.photoLink || 'images/Pavel_Morozov.jpg');
			post.append(img);



			const toolbar = document.createElement('div');
			toolbar.classList.add('toolbar');

			const like = document.createElement('img');
			like.classList.add('image-size');
			// if (photoPost.likes.findIndex(user => {
			// 	return user === this.username;
			// }) !== -1) {
			// 	like.setAttribute('src', 'images/star.png');
			// } else {
			like.setAttribute('src', 'images/star1.png');
			// }

			toolbar.append(like);

			const likeText = document.createElement('span');
			likeText.textContent = 'Lyapota';
			toolbar.append(likeText);

			const author = document.createElement('div');
			author.classList.add('post-username');
			author.textContent = photoPost.author;
			toolbar.append(author);

			console.log(photoPostsController.user);
			if (photoPostsController.user === photoPost.author) {
				const del = document.createElement('img');
				del.classList.add('image-size');
				del.setAttribute('src', 'images/img_83432.png');
				toolbar.append(del);
				post.append(toolbar);
				del.addEventListener('click', (e) => {
					const id = e.target.closest('.post').id;
					this.removePhotoPost(id);
				});

			}
			let descriptionBar = document.createElement('div');
			descriptionBar.classList.add('description-bar');

			let description = document.createElement('div');
			description.classList.add('description');
			description.textContent = photoPost.description;
			descriptionBar.append(description);

			let hashTags = document.createElement('div');
			hashTags.classList.add('hashtags');
			hashTags.textContent = photoPost.hashTags.join('');
			descriptionBar.append(hashTags);

			if (photoPostsController.user === photoPost.author) {
				img = document.createElement('img');
				img.classList.add('edit');
				img.setAttribute('width', '7%')
				img.setAttribute('src', 'images/edit.png');
				img.addEventListener('click', (e) => {
					const id = e.target.closest('.post').id;
					const description = e.target.parentNode.children[0].innerHTML;
					const hashtags = e.target.parentNode.children[1].innerHTML;
					const link = e.target.parentNode.parentNode.children[1].src;
					changePage(newPostPage, editPostListeners, { description, hashtags, link, id });
				});

				descriptionBar.append(img);
			}
			post.append(descriptionBar)


			return post;
		}

		logIn() {
			this.isLogIn = true;
			this.user = 'Vlad Kozlovsky';
			localStorage.setItem('user', this.user);
			let username = document.getElementsByClassName('username')[0];
			let logIn = document.getElementsByClassName('base-button-style')[1];
			username.textContent = this.user;
			logIn.textContent = 'Logout';
			this.setButtonsDisplay();
			this.reload();
		}

		logOut() {
			this.isLogIn = false;
			this.user = null;
			localStorage.setItem('user', this.user);
			let username = document.getElementsByClassName('username')[0];
			let logIn = document.getElementsByClassName('base-button-style')[1];
			username.textContent = 'Guest';
			logIn.textContent = 'Login'
			this.setButtonsDisplay();
			this.reload();
		}

		setButtonsDisplay() {
			let newPostButton = document.getElementsByClassName('base-button-style')[0];
			newPostButton.style.display = this.isLogIn ? 'block' : 'none';

			var toolbars = document.body.querySelectorAll('.toolbar');
			var descriptionBars = document.body.querySelectorAll('.description-bar');
			toolbars.forEach(toolbar => {
				let imgs = toolbar.querySelectorAll('img');
				imgs.forEach(item => item.style.display = this.isLogIn ? 'block' : 'none');
			});
			descriptionBars.forEach(toolbar => {
				let imgs = toolbar.querySelectorAll('img');
				imgs.forEach(item => item.style.display = this.isLogIn ? 'block' : 'none');
			});
		}

		setLike(id) {
			let res = Posts.setLike(this.user, id);
			let post = document.getElementById(id);
			let likeImages = post.getElementsByClassName('image-size')[0];
			if (res) {
				likeImages.setAttribute('src', 'images/star.png');
			} else {
				likeImages.setAttribute('src', 'images/star1.png');
			}
		}

		// setFiltersData() {
		// 	let authors = Posts.getAuthors();
		// 	let authorsList = document.getElementById('authors-tip');

		// 	hashtags.forEach(author => {
		// 		let option = document.createElement('option');
		// 		option.setAttribute('value', author);
		// 		hashtagsList.append(option);
		// 	});
		// }

	}


	window.photoPostsController = new PhotoPostsController();
	window.photoPostsController.reload();
	if (localStorage.getItem('user') !== 'null') {
		window.photoPostsController.logIn();
	}
})();