const newPostPage = (function(){
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
						<div class="time">
							2:28 25.02.2018
						</div>
					</div>
					
					<img class="new-post-img" src="images/Pavel_Morozov.jpg" height="300px" width="250px">
					<input class="new-post-file" type="file"> </input>

					<div class="description-bar">
						<input placeholder="Add description" class="description">
							
						</input>
						<input placeholder="Add hashtags" class="hashtags">
							
						</input>
						
					</div>
				</div>
</div>

`
})();