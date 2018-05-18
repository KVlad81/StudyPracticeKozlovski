(function () {

	class PhotoPostsController {

		constructor() {
			this.user = 'Vlad Kozlovsky';
			this.isLogIn = false;
			this.posts = [];
			this.feed = document.getElementsByClassName('feed')[0];
		}

		showPhotoPostsElement() {
			const posts = jsonStorage.getPosts();
			posts.forEach(post => this.feed.appendChild(this.createPhotoPostElement(post)));
			this.setButtonsDisplay();
		}

		addPhotoPost(post) {
			const posts = jsonStorage.getPosts();
			if (Posts.addPhotoPost(post)) {
				this.reload(0, posts.length);
			}
		}

		removePhotoPost(id) {
			const posts = jsonStorage.getPosts();
			if (Posts.removePhotoPost(id)) {
				if (posts.some(post => post.id === id)) {
					this.reload(0, posts.length, {});
				}
			}
		}

		editPhotoPost(id, post) {
			const posts = jsonStorage.getPosts();
			if (Posts.editPhotoPost(id, post)) {
				posts.forEach(item => {
					if (item.id === id) {
						for (let key in post) {
							item[key] = post[key];
						}
						this.replaceDomPost(item);
					}
				});
			}
		}

		replaceDomPost(newPost) {
			let post = document.getElementById(newPost.id);
			post.parentNode.replaceChild(this.createPhotoPostElement(newPost), post);
			this.setButtonsDisplay();
		}

		downloadPhotoPosts(skip = 0, top = 10, filterConfig) {
			const posts = jsonStorage.getPosts();
			let extraPosts = Posts.getPhotoPosts(skip, top, filterConfig);
			posts = posts.concat(extraPosts);
		}

		reload(skip, top, filterConfig) {
			let posts = jsonStorage.getPosts();
			posts =Posts.getPhotoPosts(skip, top, filterConfig);
			this.deleteDomPosts();

			this.showPhotoPostsElement();
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
			img.setAttribute('src', photoPost.photoLink);
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

			const del = document.createElement('img');
			del.classList.add('image-size');
			del.setAttribute('src', 'images/img_83432.png');
			toolbar.append(del);
			post.append(toolbar);
			del.addEventListener('click', (e) => {
				const id = e.target.closest('.post').id;
				this.removePhotoPost(id);
			});

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

			img = document.createElement('img');
			img.setAttribute('width', '7%')
			img.setAttribute('src', 'images/edit.png');
			descriptionBar.append(img);
			post.append(descriptionBar)


			return post;
		}

		logIn() {
			this.isLogIn = true;
			this.user = 'Vlad Kozlovsky';
			let username = document.getElementsByClassName('username')[0];
			let logIn = document.getElementsByClassName('base-button-style')[1];
			username.textContent = this.user;
			logIn.textContent = 'Logout';
			this.setButtonsDisplay();
		}

		logOut() {
			this.isLogIn = false;
			this.user = null;
			let username = document.getElementsByClassName('username')[0];
			let logIn = document.getElementsByClassName('base-button-style')[1];
			username.textContent = 'Guest';
			logIn.textContent = 'Login'
			this.setButtonsDisplay();
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

	}

	window.photoPostsController = new PhotoPostsController();
})();