'use strict';

Physijs.scripts.worker = 'js/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

var scene, renderer;
var currentCamera;

var controls;
var balls = [];
var whiteBall;

var width = 140;
var length = 280;

var state;

function initScene() {
    scene = new Physijs.Scene();
    scene.setGravity(new THREE.Vector3(0, -30 * 9.81, 0));

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x262626, 1);

    document.body.appendChild(renderer.domElement);

    //var axisHelper = new THREE.AxisHelper(500);
    //scene.add(axisHelper);
	
	// Schatten einschalten
    //renderer.shadowMap.enabled = true;
	//renderer.shadowMapType = THREE.PCFSoftShadowMap;
} // initScene

function initCamera() {
    currentCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 5000);
    currentCamera.up.set(0, 1, 0);
    currentCamera.position.set(-length, 100, 0);
    currentCamera.lookAt(0, 0, 0);

    // MOUSE controls
    controls = new THREE.OrbitControls(currentCamera, renderer.domElement);

    controls.enableZoom = true;
    controls.enablePan = false;

    controls.minDistance = 35;
    controls.maxDistance = 300;
    // lässt die Kamera nicht unter Winkel 0°
    controls.maxPolarAngle = 0.49 * Math.PI;

} // initCamera

function initLights() {
    var light = new THREE.AmbientLight(0x0d0d0d);
    scene.add(light);

    createTableLight(length / 2, 100, 100);
    createTableLight(-length / 2, 100, 100);
    createTableLight(length / 2, 100, -100);
    createTableLight(-length / 2, 100, -100);
}

function createTableLight(x, y, z) {
    var spotlight = new THREE.SpotLight(0xffffe5, 0.3);
    spotlight.position.set(x, y, z);
    spotlight.target.position.set(x, 0, z);
	spotlight.shadowDarkness = 0.5;
	spotlight.castShadow = true;
    scene.add(spotlight);
}

function initKeys() {
    var start = true;
    var startTime;
    window.onkeydown = function (eventDown) {
        if (eventDown.keyCode === 32) {   // space
            if (start) {
                start = false;
                startTime = Date.now();
            }
            window.onkeyup = function (eventUp) {
                if (eventUp.keyCode === 32) {
                    var power = Date.now() - startTime;
                    console.log(power);
                    whiteBall.hitForward(power * 10);
                    start = true;
                }
            }
        }
    }
} //initKeys


function render() {
    scene.simulate();	// run physics
    renderer.render(scene, currentCamera);
    requestAnimationFrame(render);
    handleGame();
} // render

function handleGame() {
    var play = 0;
    var checkShoot = 1;
    var fallowCamera = 2;
    var overviewCamera = 3;
    var check = 4;
    var setWhiteBall = 5;
    var end = 6;
    switch (window.state){
        case play:
            console.log("play");
            if (!whiteBall.isMoving()){
                whiteBall.createForwardLine();
                whiteBall.updateGuideLine();
                controls.update();
                controls.target.copy(whiteBall.ball.position);
            }else{
                whiteBall.forwardLine.visible = false;
            }
			break;
        case checkShoot:
            console.log("checkShoot");
            if(whiteBall.isMoving()){
                state = fallowCamera;
            }
            break;
        case fallowCamera:
            console.log("fallowCamera");
            if(whiteBall.fallDown()){
                //Foul
                state = overviewCamera;
            }
            if (coloredBallMoves() || !whiteBall.isMoving()) {
                state = overviewCamera;
            } else if (whiteBall.isMoving()){
                //Verfolgungskamera
                currentCamera.position.set(whiteBall.ball.position.x - whiteBall.forward.x * 50, 30, whiteBall.ball.position.z - whiteBall.forward.z * 50);
                currentCamera.lookAt(whiteBall.ball.position);
            } else{
                //Foul
                state = check;
            }
			break;
        case overviewCamera:
            console.log("overviewCamera");
            currentCamera.position.set(0, 300, 0);
            currentCamera.lookAt(new THREE.Vector3(0, 0, 0));
            state = check;
			break;
        case check:
            console.log("check");
			if (removeColoredBall()){
				state = play;
			}
            if(!whiteBall.isMoving() && !coloredBallMoves()){
                state = play;
            }
            else if(whiteBall.fallDown()){
                scene.remove(whiteBall);
                whiteBall = new WhiteBall(-length / 3, 2.8, 0);
                state = play;
            }
            break;
    }
}

function onLoad() {
    initScene();
    initCamera();
    initLights();

    initTable();
    window.balls = createBalls();
    whiteBall = balls[0];
    initKeys();
    window.state = 0; //start
    render();
} // onLoad
