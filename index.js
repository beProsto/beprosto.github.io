// import * as THREE from '';

// init
class AnAnimation {
	constructor(length, step) {
		this.time = 0;
		this.length = length;
		this.step = step;
		this.hasEnded = false;
	}

	update(dt) {
		if(this.time <= this.length) {
			this.time += dt;
			this.step(this.time / this.length, this.time, this.length);
		}
		else {
			this.hasEnded = true
		}
	}
}

const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 50);
camera.position.z = 1;

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(0.3,0.3,0.3);
const texture = new THREE.TextureLoader().load( './beprosto.png' );
const material = new THREE.MeshBasicMaterial( { map: texture } );

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0x1f1f1f);

// delta time calculations
let timelast = Date.now() / 1000.0;
let time = Date.now();
let dt = timelast;

// a simple 3 second long animation
const ananimation = new AnAnimation(2.0, (percentage, now, end) => {
	mesh.position.x = percentage * (camera.aspect) * 0.5;
	mesh.rotation.y = percentage;
});

function animation(time) {
	time /= 1000.0;
	dt = time - timelast;
	if(dt < 0.0) dt = 0.0;
	timelast = time;

	console.log(dt);

	ananimation.update(dt);
	if(ananimation.hasEnded) {
		mesh.rotation.y += dt;
		mesh.rotation.x += dt;
	}

	renderer.render( scene, camera );

}

window.onresize = (e) => {
	renderer.setSize( window.innerWidth, window.innerHeight );
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}