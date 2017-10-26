console.log("Hello i am main");
(function (window) {
	const Application = window.Application;
	const Mediator = window.Mediator;

	console.info("main");
	Mediator.initialize();
	const app = new Application;
	app.start();

})(window);


