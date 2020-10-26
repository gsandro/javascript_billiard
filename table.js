function initTable() {
    var physicVisibility = false;
    var thickness = 10;
    var mass = 0;
    var friction = 0.2;
    var tableBounce = 0.1;
    var holeDiameter = 10;
    var holeRadius = holeDiameter / 2;
    var edgeHight = 5;
    var edgeBounce = 1.8;
    var posY = -thickness / 2;

    //----- Sichtbarer Tisch
    visibleTable();

    //----- Grundplatte
    var baseplate = createBoxMesh(length - holeDiameter / 2, width - holeDiameter, thickness, friction, tableBounce, mass, null, null);
    baseplate.position.set(0, posY, 0);
    baseplate.rotateX(Math.PI / 2)
    scene.add(baseplate);
    baseplate.visible = physicVisibility;

    //----- Löcher & Ecken
    var positions = [
        new THREE.Vector3(length / 2 - 2, posY, width / 2), //hinten rechts
        new THREE.Vector3(0, posY, width / 2 + 3.5), //mitte rechts
        new THREE.Vector3(length / 2 - 2, posY, -width / 2), //hinten links
        new THREE.Vector3(-length / 2 + 2, posY, width / 2), //vorne rechts
        new THREE.Vector3(0, posY, -width / 2 - 3.5), //mitte links
        new THREE.Vector3(-length / 2 + 2, posY, -width / 2)];//vorne links
    var cubeLength = thickness;
    var d = holeRadius + cubeLength / 2;
    var von = 0;
    var bis = 2 * Math.PI;

    for (var i = 0; i < positions.length; i++) {
        //Löcher
        for (var alpha = 0; alpha < 2 * Math.PI; alpha += 0.6) {
            var cube = createBoxMesh(cubeLength, thickness, cubeLength, friction, tableBounce, mass, null, null);
            cube.position.set(positions[i].x + d * Math.cos(alpha), positions[i].y, positions[i].z + d * Math.sin(alpha));
            cube.rotation.y = -alpha;
            scene.add(cube);
            cube.visible = physicVisibility;
        }
        //Kanten über den Löchern
        switch (i) {
            case 0:  // hinten rechts
                von = -1 * Math.PI / 6;
                bis = 4 * Math.PI / 6;
                break;
            case 1:  // mitte rechts
                von = 1 * Math.PI / 6;
                bis = 5 * Math.PI / 6;
                break;
            case 2:  // hinten links
                von = -4 * Math.PI / 6;
                bis = Math.PI / 6;
                break;
            case 3:// vorne rechts
                von = 2 * Math.PI / 6;
                bis = 7 * Math.PI / 6;
                break;
            case 4:  // mitte links
                von = -5 * Math.PI / 6;
                bis = -Math.PI / 6;
                break;
            case 5:  // vorne links
                von = 5 * Math.PI / 6;
                bis = 10 * Math.PI / 6;
                break;
            default:
                von = 0;
                bis = 2 * Math.PI;
                break;
        }

        for (var alpha = von; alpha < bis; alpha += 0.6) {
            var cube = createBoxMesh(cubeLength, edgeHight, cubeLength, friction, tableBounce, mass, null, null);
            cube.position.set(positions[i].x + d * Math.cos(alpha), positions[i].y + 3 / 2 * edgeHight, positions[i].z + d * Math.sin(alpha));
            cube.rotation.y = -alpha;
            scene.add(cube);
            cube.visible = physicVisibility;
        }

    }

    widthEdge1 = createBoxMesh(thickness, thickness + edgeHight, width - holeDiameter - 5, friction, edgeBounce, mass, null, null);
    widthEdge1.position.set(length / 2 + 2.5, -edgeHight / 2, 0);
    scene.add(widthEdge1);
    widthEdge1.visible = physicVisibility;

    widthEdge2 = createBoxMesh(thickness, thickness + edgeHight, width - holeDiameter - 5, friction, edgeBounce, mass, null, null);
    widthEdge2.position.set(-length / 2 - 2.5, -edgeHight / 2, 0);
    scene.add(widthEdge2);
    widthEdge2.visible = physicVisibility;

    lengthEdge1 = createBoxMesh(length / 2 - holeDiameter - 5, thickness + edgeHight, thickness, friction, edgeBounce, mass, null, null);
    lengthEdge1.position.set(length / 4 - holeRadius / 2, -edgeHight / 2, width / 2 + holeRadius - 1);
    scene.add(lengthEdge1);
    lengthEdge1.visible = physicVisibility;

    lengthEdge2 = createBoxMesh(length / 2 - holeDiameter - 5, thickness + edgeHight, thickness, friction, edgeBounce, mass, null, null);
    lengthEdge2.position.set(-length / 4 + holeRadius / 2, -edgeHight / 2, width / 2 + holeRadius - 1);
    scene.add(lengthEdge2);
    lengthEdge2.visible = physicVisibility;

    lengthEdge3 = createBoxMesh(length / 2 - holeDiameter - 5, thickness + edgeHight, thickness, friction, edgeBounce, mass, null, null);
    lengthEdge3.position.set(-length / 4 + holeRadius / 2, -edgeHight / 2, -width / 2 - holeRadius + 1);
    scene.add(lengthEdge3);
    lengthEdge3.visible = physicVisibility;

    lengthEdge4 = createBoxMesh(length / 2 - holeDiameter - 5, thickness + edgeHight, thickness, friction, edgeBounce, mass, null, null);
    lengthEdge4.position.set(length / 4 - holeRadius / 2, -edgeHight / 2, -width / 2 - holeRadius + 1);
    scene.add(lengthEdge4);
    lengthEdge4.visible = physicVisibility;

    baseplate1 = createBoxMesh(length / 2 - holeDiameter - 5, thickness, thickness, friction, tableBounce, mass, null, null);
    baseplate1.position.set(length / 4, -thickness / 2, width / 2);
    scene.add(baseplate1);
    baseplate1.visible = physicVisibility;

    baseplate2 = createBoxMesh(length / 2 - holeDiameter - 5, thickness, thickness, friction, tableBounce, mass, null, null);
    baseplate2.position.set(-length / 4, -thickness / 2, width / 2);
    scene.add(baseplate2);
    baseplate2.visible = physicVisibility;

    baseplate3 = createBoxMesh(length / 2 - holeDiameter - 5, thickness, thickness, friction, tableBounce, mass, null, null);
    baseplate3.position.set(-length / 4, -thickness / 2, -width / 2);
    scene.add(baseplate3);
    baseplate3.visible = physicVisibility;

    baseplate4 = createBoxMesh(length / 2 - holeDiameter - 5, thickness, thickness, friction, tableBounce, mass, null, null);
    baseplate4.position.set(length / 4, -thickness / 2, -width / 2);
    scene.add(baseplate4);
    baseplate4.visible = physicVisibility;

} // initTable

visibleTable = function () {

    var loader = new THREE.JSONLoader();
    var offsetX = 2.5;
    var offsetY = 1.5;
    var meshX = -length / 2 + offsetX;
    var meshY = 0;
    var meshZ = +width / 2 - offsetY;
    var scalefactor = 100;

    loader.load('models/table/basis.json', function (geometry) {
        var base = new Physijs.Mesh(geometry, new THREE.MeshPhysicalMaterial({color: 0x603311}));
        base.position.x = meshX;
        base.position.y = meshY;
        base.position.z = meshZ;
        base.scale.set(scalefactor, scalefactor, scalefactor);
        scene.add(base);
		base.receiveShadow = true;
    });

    loader.load('models/table/feld.json', function (geometry) {
        var field = new Physijs.Mesh(geometry, new THREE.MeshPhysicalMaterial({color: 0x008000, reflectivity: 0.8}));
        field.position.x = meshX;
        field.position.y = meshY;
        field.position.z = meshZ;
        field.scale.set(scalefactor, scalefactor, scalefactor);
		scene.add(field);
		field.receiveShadow = true;
    });

    loader.load('models/table/kanten.json', function (geometry) {
        var edge = new Physijs.Mesh(geometry, new THREE.MeshPhysicalMaterial({color: 0x603311}));
        edge.position.x = meshX;
        edge.position.y = meshY;
        edge.position.z = meshZ;
        edge.scale.set(scalefactor, scalefactor, scalefactor);
        scene.add(edge);
		edge.receiveShadow = true;
    });

    loader.load('models/table/lochinhalt.json', function (geometry) {
        var mesh = new Physijs.Mesh(geometry, new THREE.MeshPhysicalMaterial({color: 0x7a5230, reflectivity: 0.8}));
        mesh.position.x = meshX;
        mesh.position.y = meshY;
        mesh.position.z = meshZ;
        mesh.scale.set(scalefactor, scalefactor, scalefactor);
        scene.add(mesh);
		mesh.receiveShadow = true;
    });

    loader.load('models/table/lochboden.json', function (geometry) {
        var mesh = new Physijs.Mesh(geometry, new THREE.MeshPhysicalMaterial({color: 0x888000, reflectivity: 0.8}));
        mesh.position.x = meshX;
        mesh.position.y = meshY;
        mesh.position.z = meshZ;
        mesh.scale.set(scalefactor, scalefactor, scalefactor);
        scene.add(mesh);

    });

}//visibleTable

function createBoxMesh(l, w, t, friction, bounce, mass, damping, map) {
    var geometry = new THREE.BoxGeometry(l, w, t);
    var material = new THREE.MeshLambertMaterial();
    var spielfeld = new Physijs.BoxMesh(geometry, Physijs.createMaterial(material, friction, bounce), mass);
    if (damping) {
        spielfeld.setDamping(damping, damping);
    }
    return spielfeld;
} // createBoxMesh