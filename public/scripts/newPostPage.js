const newPostPage = function(description,hashtags, link){
return `
<div class="new-post-page">
	<div class="new-post__buttons">
		<button class='base-button-style save-post'>
			Save Post
		</button>
	</div>
	<div  class="new-post">
					<div class="toolbar">
						<div class="post-username">Username</div>
					</div>
					
					<img class="new-post-img" src=${link?link:'images/Pavel_Morozov.jpg'} height="300px" width="250px">
					<input class="new-post-file" type="file"> </input>

					<div class="description-bar">
						<textarea placeholder="Add description" class="description">${description?description:''}</textarea>
						<textarea placeholder="Add hashtags" class="hashtags">${hashtags?hashtags:''}</textarea>
						
					</div>
				</div>
</div>

`
};