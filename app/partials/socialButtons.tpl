					<div class="social-button col-md-4"><% for (var i = 0; i < social.length; i++) { %>
						<a href="/authenticate/<%= social [i].name %>"><img src="assets/img/<%= social [i].icon %>" alt="{{ 'login.btn.loginWithGithub' | translate }}" /></a><% } %>
					</div>
