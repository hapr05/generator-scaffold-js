<% for (var i = 0; i < social.length; i++) { %>
		server.auth.strategy ('<%= social [i].name %>', '<%= social [i].name %>' === fail ? 'failed' : 'succeed');<% } %>
