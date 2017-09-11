
var
nodemailer  = require('nodemailer'),
    
emailTransportSingleton  = (function() {
	function EmailTransport(config) {
		this.configure(config);
	}
	
	/**
	 *
	 * @param config
	 * @example : {
		mailEnabled: true,
		mailTransportName: 'SMTP',
		mailTransportConfig: {
			service: 'Gmail',
			auth: {
				user: 'youremail', // Your email id
				pass: 'yourpass' // Your password
			}
		},
		mailSubject: 'advanced.js crashreporter test',
		mailFrom: 'crashreporter <your@gmail.com>',
		mailTo: 'to@email.com'
	}
	 */
	EmailTransport.prototype.configure = function(config) {
		config = config ||  {};
		this.mailEnabled = config.mailEnabled;
		this.mailTransportName = config.mailTransportName;
		this.mailTransportConfig = config.mailTransportConfig;
		this.mailSubject = config.mailSubject || 'crashreporter';
		this.mailFrom = config.mailFrom;
		this.mailTo = config.mailTo;
	};
	
	EmailTransport.prototype.addTransport = function(transport, transportConfig) {
		transport.configure(transportConfig);
	}
        


	EmailTransport.prototype.runTransport = function(err) {
		if (!this.sendMail(data)) { // should always be the last call
			this.exit();
		}
	};

	CrashReporter.prototype.sendMail = function(plaintextBody) {

		// create reusable transport method (opens pool of SMTP connections)
		mailTransport = nodemailer.createTransport(this.mailTransportConfig),

		// setup e-mail data with unicode symbols
		mailOptions = {
		    from:  this.mailFrom, // sender address
		    to: this.mailTo, // list of receivers
		    subject: this.mailSubject, // Subject line
		    text: plaintextBody // plaintext body
		};

		// send mail with defined transport object
		mailTransport.sendMail(mailOptions, function(error, response){
		    if(error){
		    	this.crashExit(error);
		    }else{
		        console.error("Message sent: " + response.message);
		    }

		    // if you don't want to use this transport object anymore, uncomment following line
		    mailTransport.close(); // shut down the connection pool, no more messages

		    this.exit();
		}.bind(this));
		return true;
	};

	CrashReporter.prototype.exit = function() {
		if (this.exitOnCrash) {
			process.nextTick(function() {
				process.exit(1); // should exit after all 'uncaughtException' event calls
			});
		}
	};

	CrashReporter.prototype.crashExit = function(error, exit) {
		exit = exit !== false;
		console.log(exit);
		console.error('\n-------------------\ncrashreporter Error\n-------------------');
		console.error(error.stack || error);
		if (exit) {
			process.exit(1);
		}
	};




	if (!crashReporterSingleton) {
		exports._singleton = crashReporterSingleton = new CrashReporter();
	}
	return crashReporterSingleton;
}());

exports.configure = function (config) {
	crashReporterSingleton.configure(config);
};