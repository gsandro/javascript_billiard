var loader = new THREE.TextureLoader();

function createBalls() {
    var offX = length / 8;
    var r = 2.5;
    var whiteBall = new WhiteBall(-length / 3, 2.5, 0);
    var nr = 1;
    var ball1 = createAndAddBallToScene(offX + 0, r, 0, nr++);
    var ball2 = createAndAddBallToScene(offX + 2 * r, r, +r, nr++);
    var ball3 = createAndAddBallToScene(offX + 2 * r, r, -r, nr++);
    var ball4 = createAndAddBallToScene(offX + 4 * r, r, 0, nr++);
    var ball5 = createAndAddBallToScene(offX + 4 * r, r, 2 * r, nr++);
    var ball6 = createAndAddBallToScene(offX + 4 * r, r, -2 * r, nr++);
    var ball7 = createAndAddBallToScene(offX + 6 * r, r, +r, nr++);
    var ball8 = createAndAddBallToScene(offX + 6 * r, r, -r, nr++);
    var ball9 = createAndAddBallToScene(offX + 8 * r, r, 0, nr);

    return [whiteBall, ball1, ball2, ball3, ball4, ball5, ball6, ball7, ball8, ball9];
}


function createAndAddBallToScene(x, y, z, ballNr) {
    var ballContainer = {};
    var ball = null;

    loader.load('models/balls/' + ballNr + 'ball.png', function (textur) {
        var radius = 2.5;
        ball = new Physijs.SphereMesh(new THREE.SphereGeometry(radius, 20, 20),
            // (material,reflexion,reibung,restitution,gewicht)
            Physijs.createMaterial(new THREE.MeshPhysicalMaterial({map: textur}), 0.4, 0.8, 50));

        ball.position.x = x;
        ball.position.y = y;
        ball.position.z = z;
        scene.add(ball);
        ball.setDamping(0.4, 0.4);
        ball.castShadow = true;
        ballContainer.ball = ball;
    });

    return ballContainer;
}

window.Ball = createAndAddBallToScene;

function coloredBallMoves() {
    //ohne WhiteBall
	var bol = false;
    for(var index = 1; index < balls.length; index++) {
        if(balls[index].ball.getLinearVelocity().lengthSq() !== 0 && balls[index].ball.getAngularVelocity().lengthSq() !== 0){
			bol = true;
		}
    }
	return bol;
}

function removeColoredBall() {
    //ohne WhiteBall
	var bol = false;
    for(var index = 1; index < balls.length; index++) {
        if(balls[index].ball.position.y <= -80){
			balls[index].ball.setWeight = 0;
			scene.remove(balls[index]);
			bol = true;
		}
    }
	return bol;
}

function WhiteBall(x, y, z) {
    this.ball = this.createBall();
    this.ball.position.x = x;
    this.ball.position.y = y;
    this.ball.position.z = z;
    scene.add(this.ball);
    controls.target.copy(this.ball.position);
    // ballLinearDamping,ballRotationalDamping
    this.ball.setDamping(0.4, 0.4);

    this.forward = new THREE.Vector3(1, 0, 0);
    this.forwardLine = this.createForwardLine();
}

WhiteBall.prototype.createBall = function () {
    this.radius = 2.5;
    var ball = new Physijs.SphereMesh(new THREE.SphereGeometry(this.radius, 20, 20),
        // (farbe,reflexion,reibung,restitution,gewicht)
        Physijs.createMaterial(new THREE.MeshPhysicalMaterial({color: 0xffffe5, reflectivity: 0.8}), 0.4, 0.8, 50));
    ball.castShadow = true;
    return ball;
};

WhiteBall.prototype.hitForward = function (strength) {
    var force = new THREE.Vector3();
    force.copy(this.forward.normalize());
    force.multiplyScalar(strength);
    this.ball.applyCentralImpulse(force);
    this.forwardLine.visible = false;
    window.state = 1; //checkShoot
};

WhiteBall.prototype.isMoving = function () {
    return (this.ball.getLinearVelocity().lengthSq() !== 0 && this.ball.getAngularVelocity().lengthSq() !== 0);
};

WhiteBall.prototype.fallDown = function () {
    return this.ball.position.y <= -10;
};

WhiteBall.prototype.updateGuideLine = function () {
    var angle = controls.getAzimuthalAngle() + Math.PI / 2;
    this.forward.set(Math.cos(angle), 0, -Math.sin(angle));

    this.forwardLine.position.copy(this.ball.position);
    this.forwardLine.visible = true;

    this.forwardLine.rotation.y = angle;
    this.forward.normalize();

    this.forwardLine.geometry.verticesNeedUpdate = true;
};

WhiteBall.prototype.createForwardLine = function () {
    var lineGeometry = new THREE.Geometry();
    var vertArray = lineGeometry.vertices;

    vertArray.push(new THREE.Vector3(0, 0, 0));
    vertArray.push(new THREE.Vector3(35, 0, 0));
    lineGeometry.computeLineDistances();
    var lineMaterial = new THREE.LineDashedMaterial({color: 0xdddddd, dashSize: 4, gapSize: 2});
    var line = new THREE.Line(lineGeometry, lineMaterial);
    line.position.copy(new THREE.Vector3(0, -5, 0)); //Grundlinie verstecken
    line.box = new THREE.Box3(
        new THREE.Vector3(-length / 2, 0, -width / 2),
        new THREE.Vector3(length / 2, 2 * this.ball.radius, width / 2)
    );
    line.ray = new THREE.Ray(this.ball.position, this.forward);
    scene.add(line);
    return line;
};
