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
    this.modelLoader = new THREE.JSONLoader();
    //this.manager = new THREE.LoadingManager();
    //this.manager.onProgress = function ( item, loaded, total ) {

        //console.log( item, loaded, total );

    //};
    //this.modelLoader = new THREE.OBJLoader(this.manager);
    this.filename = '';
    this.loadedModel = null;
    this.debug = true;
};

Games.prototype.update = function() {
    //Perform any updates
    var delta = this.clock.getDelta();
    var clicked = this.mouse.down;

    //Check pick actions
    if(this.pickedObjects.length != 0) {
        console.log('Picked ', this.pickedObjects[0].object.name);
        this.pickedObject = this.scene.getObjectByName(this.pickedObjects[0].object.name);
        if(this.pickedObject) {
            this.animate = true;
        }
        this.pickedObjects.length = 0;
    }

    if(this.loadedModel != null) {
        if(this.debug) {
            console.log('Model =', this.loadedModel);
            this.debug = false;
        }

    }

    if(this.animate) {
        this.pickedObject.position.z += 15;
        this.animate = false;
    }

    BaseApp.prototype.update.call(this);
};

Games.prototype.createScene = function() {
    //Init base createsScene
    BaseApp.prototype.createScene.call(this);

    var _this = this;
    this.modelLoader.load('models/door.js', function(geom, materials) {
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
};


$(document).ready(function() {
    //Initialise app
    var container = document.getElementById("WebGL-output");
    var app = new Games();
    app.init(container);
    app.createScene();

    app.run();
});
