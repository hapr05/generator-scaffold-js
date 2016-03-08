(function () {
	'use strict';

	function exit () {
		process.exit (1);
	}   

	require ('./src/server').start ().catch ((err, server) => {
		if (server) {
			server.stop ().then (exit).catch (exit);
		} else {
			exit (); 
		}   
	}); 
} ());
