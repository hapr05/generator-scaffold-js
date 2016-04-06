'use strict';

require ('harmony-reflect');

const exit = () => {
	process.exit (1);
};   

require ('./src/server').start ().catch ((err, server) => {
	if (!err && server) {
		server.stop ().then (exit).catch (exit);
	} else {
		exit (); 
	}   
}); 
