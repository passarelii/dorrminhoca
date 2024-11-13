const assets = ["ESKARGOT.ttf"];
const path = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1604712/";
const frame = new Frame("fit", 1024, 768, darker, pink, assets, path);
frame.on("ready", ()=>{ // ES6 Arrow Function - similar to function(){}
    zog("ready from ZIM Frame"); // logs in console (F12 - choose console)

    // often need below - so consider it part of the template
    let stage = frame.stage;
    let stageW = frame.width;
    let stageH = frame.height;

    // REFERENCES for ZIM at http://zimjs.com
    // see http://zimjs.com/learn.html for video and code tutorials
    // see http://zimjs.com/docs.html for documentation
    // see https://www.youtube.com/watch?v=pUjHFptXspM for INTRO to ZIM
    // see https://www.youtube.com/watch?v=v7OT0YrDWiY for INTRO to CODE

    // CODE HERE
   
		STYLE = {font:"eskargot", size:44}
		var heart = new Blob({
			interactive:false,
			color:"#cc0000",
			points:[[0,-40.7,0,0,-57.3,-76.6,41.8,-80.3,"mirror"],[100,0,0,0,23.7,-45.4,-23.7,45.4,"mirror"],[0,100,0,0,0,0,0,0,"mirror"],[-100,0,0,0,21.9,48.2,-21.9,-48.2,"mirror"]]
		}).sca(3)

		var pane = new Pane({
			label:"CONTROL MY HEART 2",
			color:white,
			backing:heart,
			displayClose:false,
			backdropClose:false,
		}).show();
		pane.label.mov(0,-20)

		STYLE = {size:24}
		var tabs = new Tabs({
			width:330,
			height:60,
			tabs:["MOUSE", "GAMEPAD"],
			currentSelected:false,
			spacing:30,
			backgroundColor:pink,
			rollBackgroundColor:yellow
		}).center(pane).mov(0,80).tap(function () {
			start(tabs.text=="MOUSE"?"follow":"gamestick");
			pane.hide();
		})
		
		function start(type) {
			var tile = new Tile({
				obj:new Circle({min:5, max:20}, [red, dark, pink, pink, pink, purple, purple]),
				cols:6,
				rows:6,
				spacingH:500,
				spacingV:500
			}).animate({
				props:{scale:2},
				rewind:true,
				loop:true,
				ease:"elasticOut",
				time:{min:1500, max:3000},
				sequence:0
			});
			
			var total = tile.items.length;
			tile.loop(dot=>{
				if (dot.color == dark) total--;
			});

			var world = new Container(tile.width, tile.height).center();

			tile.centerReg(world);
			var edges = new Rectangle(tile.width+400, tile.height+400, clear, pink, 2, 50, true).alp(.5)
				.center(world);

			const heart = new Blob({
				color:"#cc0000",
				borderColor:"white",
				borderWidth:5,
				interactive:false,
				points:[[0,-40.7,0,0,-57.3,-76.6,41.8,-80.3,"mirror"],[100,0,0,0,23.7,-45.4,-23.7,45.4,"mirror"],[0,100,0,0,0,0,0,0,"mirror"],[-100,0,0,0,21.9,48.2,-21.9,-48.2,"mirror"]]
			})
				.transformPoints("scale", .8)
				.transformPoints("rotation", 90)
				.centerReg(world);

			frame.follow(heart);

			const colors = [purple, pink, blue, green, yellow, orange, red];
			const colorSeries = series(colors);
			function makeStar() { // each particle calls this function - to randomize the colors
				let star = new Shape(-20,-20,40,40);
				star.graphics.f(shuffle(colors)[0]).dp(0,0,18,6,rand(.5,.8));
				return star.sca(2);
			}

			const emitter = new Emitter({
				startPaused:true,
				obj:new Circle(40, [pink, red, "#ff0000"]),
				gravity:0,
				force:10,
				interval:30,
				decayTime:500,
				life:500,
				angle:180
			}).loc(heart,null,stage,0);

			const stars = new Emitter({
				obj:makeStar, // ZIM VEE value or PICK - lets you pass a function that will be evaluated later - with random colors
				random:{rotation:{min:0, max:360}}, // start at random rotations for star
				num:3, // send two at once
				life:1000,
				decayTime:1000,
				animation:{props:{rotation:[-360,360]}, ease:"linear", loop:true}, // rotate one way or the other
				startPaused:true, // wait until the emitter is spurted when the ball contacts a pin
			});

			const pieces = new Emitter({
				obj:new Rectangle(40,40,[black,grey,dark]), // ZIM VEE value or PICK - lets you pass a function that will be evaluated later - with random colors
				random:{rotation:{min:0, max:360}}, // start at random rotations for star
				num:3, // send two at once
				life:1000,
				decayTime:1000,
				animation:{props:{rotation:[-360,360]}, ease:"linear", loop:true}, // rotate one way or the other
				startPaused:true, // wait until the emitter is spurted when the ball contacts a pin
			});

			const controller = new MotionController({
				target:heart,
				type:type,
				map:[[0,2],[0,2],[1,3],[1,3]],
				container:world,
				rotate:true,
				speed:10,
				boundary:new Boundary(0,0,tile.width,tile.height)
			});
			controller.on("startmoving", function () {
				emitter.pauseEmitter(false);
			});
			controller.on("stopmoving", function () {
				emitter.pauseEmitter(true);
			});

			const speed = controller.speed;
			let snap = null;
			if (controller.gamepad) {
				controller.gamepad.on("buttondown", function (e) {
					if (e.button == "A") showMap();
				});
				controller.gamepad.on("buttonup", function (e) {
					if (e.button == "A") hideMap();
				});
			} else {
				frame.on("keydown", function (e) {
					if (e.keyCode == 32) showMap();
				});
				frame.on("keyup", function (e) {
					if (e.keyCode == 32) hideMap();
				});
			}

			let mapCheck = false;
			function showMap() {
				if (mapCheck) return;
				mapCheck = true;
				controller.speed=0;
				emitter.particles.alp(0);
				heart.addTo(tile);
				tile.scaleTo(stage,70,70);
				snap = new Bitmap(world).center();
				tile.sca(1);
				heart.addTo(world);
				world.visible = false;
				stage.update();
			}
			function hideMap() {
				if (!mapCheck) return;
				mapCheck = false;
				controller.speed=speed;
				emitter.particles.alp(1);
				world.visible = true;
				if (snap) snap.removeFrom();
				stage.update();
			}

			var timer = new Timer({backgroundColor:yellow, down:false, time:0, colon:true}).pos(30,30);
			var scorer = new Scorer({backgroundColor:pink, score:total}).pos(30,30,RIGHT);
			
			if (type=="gamestick") {
				new Label("gamepad A - show map", null, null, white)
					.alp(.5)
					.pos(0,50,CENTER,BOTTOM)
					.animate({
						wait:2000,
						props:{alpha:0}
					});
			} else {
				var map = new Button({
					label:"MAP",
					backgroundColor:blue,
					rollBackgroundColor:green,
					corner:5,
					width:100
				}).sca(.8).pos(30,30,LEFT,BOTTOM);
				map.on("mousedown", showMap);
				map.on("pressup", hideMap);
			}

			Ticker.add(function () {
				emitter.loc(heart);
				emitter.angle = heart.rotation + 180;

				tile.loop(dot=>{
					if (heart.color == "#cc0000" && heart.hitTestCircle(dot)) {
						if (dot.color == dark) {
							pieces.loc(dot).spurt(10);
							heart.color = grey;
							timeout(5000, function () {
								heart.color = "#cc0000";
							})
						} else if (dot.color == red) {
							stars.loc(dot).spurt(30);
							scorer.score--;
							if (scorer.score <= 0) {
								win.show().mov(0,170);
								timer.stop();
							}
						} else {
							stars.loc(dot).spurt(10);
							scorer.score--;
							if (scorer.score <= 0) {
								win.show().mov(0,170);
								timer.stop();
							}
						}
						dot.removeFrom();
					}
				}, true); // loop backwards when removing
			});

			const win = new Pane(1600, 100, "I LOVE YOU!", red, white);
		}



    stage.update(); // this is needed to show any changes
  
    // DOCS FOR ITEMS USED
	// https://zimjs.com/docs.html?item=Frame
	// https://zimjs.com/docs.html?item=Container
	// https://zimjs.com/docs.html?item=Shape
	// https://zimjs.com/docs.html?item=Bitmap
	// https://zimjs.com/docs.html?item=Circle
	// https://zimjs.com/docs.html?item=Rectangle
	// https://zimjs.com/docs.html?item=Blob
	// https://zimjs.com/docs.html?item=Label
	// https://zimjs.com/docs.html?item=Button
	// https://zimjs.com/docs.html?item=Pane
	// https://zimjs.com/docs.html?item=Tabs
	// https://zimjs.com/docs.html?item=Tile
	// https://zimjs.com/docs.html?item=tap
	// https://zimjs.com/docs.html?item=hitTestCircle
	// https://zimjs.com/docs.html?item=animate
	// https://zimjs.com/docs.html?item=loop
	// https://zimjs.com/docs.html?item=pos
	// https://zimjs.com/docs.html?item=loc
	// https://zimjs.com/docs.html?item=mov
	// https://zimjs.com/docs.html?item=alp
	// https://zimjs.com/docs.html?item=sca
	// https://zimjs.com/docs.html?item=scaleTo
	// https://zimjs.com/docs.html?item=addTo
	// https://zimjs.com/docs.html?item=removeFrom
	// https://zimjs.com/docs.html?item=centerReg
	// https://zimjs.com/docs.html?item=center
	// https://zimjs.com/docs.html?item=MotionController
	// https://zimjs.com/docs.html?item=Emitter
	// https://zimjs.com/docs.html?item=timeout
	// https://zimjs.com/docs.html?item=Boundary
	// https://zimjs.com/docs.html?item=series
	// https://zimjs.com/docs.html?item=transformPoints
	// https://zimjs.com/docs.html?item=zog
	// https://zimjs.com/docs.html?item=STYLE
	// https://zimjs.com/docs.html?item=Ticker
  
    // FOOTER
    // call remote script to make ZIM Foundation for Creative Coding icon
    createIcon(); 

}); // end of ready