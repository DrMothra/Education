/**
 * Created by DrTone on 20/08/2014.
 */


//Init this app from base
function Games() {
    BaseApp.call(this);
}

Games.prototype = new BaseApp();

Games.prototype.init = function(container) {
    BaseApp.prototype.init.call(this, container);
    this.updateRequired = false;
    this.guiControls = null;
    this.doorMaterial = null;
    this.doorGeom = null;
    this.pickedObject = null;
    this.animate = false;
    this.animatingTranslation = false;
    this.animatingRotation = false;
    //this.modelLoader = new THREE.JSONLoader();
    this.modelLoader = new THREE.OBJMTLLoader();
    this.animationTime = 1;
    this.totalDelta = 0;
    this.animationDiff = new THREE.Vector3();
    this.diffPos = new THREE.Vector3();
    this.startPos = new THREE.Vector3();
    this.endPos = new THREE.Vector3(0, -5, 15);
    this.startRot = 0;
    this.rotInc = 3*Math.PI/4;
};

Games.prototype.update = function() {
    //Perform any updates
    var delta = this.clock.getDelta();
    var clicked = this.mouse.down;

    //Check pick actions
    if(this.pickedObjects.length != 0) {
        var name = this.pickedObjects[0].object.name;
        console.log('Picked =', name);
        this.pickedObject = this.scene.getObjectByName(name, true);
        if(this.pickedObject) {
            this.animate = true;
        }
        this.pickedObjects.length = 0;
    }

    if(this.animate) {
        this.animationDiff.copy(this.endPos);
        this.startPos.copy(this.pickedObject.position);
        this.animationDiff.sub(this.pickedObject.position);

        this.animate = false;
        this.animatingTranslation = true;
    }

    if(this.animatingTranslation) {
        this.totalDelta += delta;
        if(this.totalDelta >= this.animationTime) {
            this.pickedObject.position = this.endPos;
            this.animatingTranslation = false;
            this.diffPos.set(0, 0, 0);
            this.totalDelta = 0;
            this.animatingRotation = true;
        } else {
            var deltaTime = delta/this.animationTime;
            this.diffPos.x += deltaTime * this.animationDiff.x;
            this.diffPos.y += deltaTime * this.animationDiff.y;
            this.diffPos.z += deltaTime * this.animationDiff.z;
            this.pickedObject.position.addVectors(this.startPos, this.diffPos);
        }
    }

    if(this.animatingRotation) {
        this.totalDelta += delta;
        if(this.totalDelta >= this.animationTime) {
            this.pickedObject.rotation = this.startRot + this.rotInc;
            this.animatingRotation = false;
            this.totalDelta = 0;
        } else {
            this.pickedObject.rotation.y += (delta/this.animationTime) * this.rotInc;
        }
    }

    BaseApp.prototype.update.call(this);
};

Games.prototype.createScene = function() {
    //Init base createsScene
    BaseApp.prototype.createScene.call(this);

    var _this = this;
    this.modelLoader.load( 'models/doorWhole.obj', 'models/doorWhole.mtl', function ( object ) {
        for(var i=-1; i<2; ++i ) {
            var door = object.clone();
            door.position.x = i*10;
            door.name = 'door'+i;
            _this.scene.add( door );
        }
    } );
    /*
    this.modelLoader.load('models/doorWhole.js', function(geom, materials) {
        //Model loaded, create groups, etc.
        _this.doorMaterial = materials;
        _this.doorGeom = geom;
        for(var i=-1; i<2; ++i) {
            var doorMat = new THREE.MeshFaceMaterial(_this.doorMaterial);
            var doorMesh = new THREE.Mesh(_this.doorGeom, doorMat);
            doorMesh.position.x = i*10;
            doorMesh.name = 'door'+i;
            _this.scene.add(doorMesh);
        }
    });
    */
};


$(document).ready(function() {
    //Initialise app
    var container = document.getElementById("WebGL-output");
    var app = new Games();
    app.init(container);
    app.createScene();

    app.run();
});
