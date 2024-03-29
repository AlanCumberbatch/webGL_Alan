
import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';// 可以显示当前帧率
/*
Official Three Example:
*/
export const demoThreeCamera = (scene, sceneRef) => {
  let SCREEN_WIDTH = window.innerWidth;
	let SCREEN_HEIGHT = window.innerHeight;
  let aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
  const frustumSize = 600;

  // scene
  // camera
  let stats;
  let camera, renderer ;
  let cameraRig, activeCamera, activeHelper;
  let cameraPerspective, cameraOrtho;
  let cameraPerspectiveHelper, cameraOrthoHelper;

  camera = new THREE.PerspectiveCamera( 50, 0.5 * aspect, 1, 10000 );// 观看 另外两个 camera 的camera
  camera.position.z = 2500;
  // PerspectiveCamera( fov : Number, aspect : Number, near : Number, far : Number )
	cameraPerspective = new THREE.PerspectiveCamera( 50, 0.5 * aspect, 150, 1000 );
	cameraPerspectiveHelper = new THREE.CameraHelper( cameraPerspective );
  scene.add(cameraPerspectiveHelper);

  //
  // // OrthographicCamera( left : Number, right : Number, top : Number, bottom : Number, near : Number, far : Number )
  // cameraOrtho = new THREE.OrthographicCamera(0.5 * frustumSize * aspect / - 2, 0.5 * frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 150, 1000);
  // // CameraHelper： This helps with visualizing what a camera contains in its frustum. It visualizes the frustum of a camera using a LineSegments.
  // cameraOrthoHelper = new THREE.CameraHelper( cameraOrtho );
  // scene.add(cameraOrthoHelper);

  //
	activeCamera = cameraPerspective;
  activeHelper = cameraPerspectiveHelper;

  // counteract different front orientation of cameras vs rig
  // cameraOrtho.rotation.y = Math.PI;
  cameraPerspective.rotation.y = Math.PI;

  cameraRig = new THREE.Group();
  cameraRig.add( cameraPerspective );
  // cameraRig.add( cameraOrtho );

  scene.add(cameraRig);

  // entity
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry( 100, 16, 8 ),
    new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } )
  );
  scene.add( mesh );

  const mesh2 = new THREE.Mesh(
    new THREE.SphereGeometry( 50, 16, 8 ),
    new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } )
  );
  mesh2.position.y = 150;
  mesh.add( mesh2 );

  const mesh3 = new THREE.Mesh(
    new THREE.SphereGeometry( 5, 16, 8 ),
    new THREE.MeshBasicMaterial( { color: 0x0000ff, wireframe: true } )
  );
  mesh3.position.z = 150;
  cameraRig.add(mesh3);

  //
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  for (let i = 0; i < 10000; i++) {
    // THREE.MathUtils.randFloatSpread： Random float from <-range/2, range/2> interval
    vertices.push( THREE.MathUtils.randFloatSpread( 2000 ) ); // x
    vertices.push( THREE.MathUtils.randFloatSpread( 2000 ) ); // y
    vertices.push( THREE.MathUtils.randFloatSpread( 2000 ) ); // z
  }
  geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
  const particles = new THREE.Points( geometry, new THREE.PointsMaterial( { color: 0x888888 } ) );
  scene.add( particles );

  // render
  //
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
  // container.appendChild( renderer.domElement );
  sceneRef.current?.appendChild(renderer.domElement);

  renderer.autoClear = false;

  // test
  // test

  //

  stats = new Stats();
  stats.dom.style.left = window.innerWidth - 100 + 'px';
  sceneRef.current?.appendChild(stats.dom);

  // animation
  const animate = function () {
    requestAnimationFrame( animate );

    render();
    stats.update();
  };

  function render() {

    const r = Date.now() * 0.0005;

    mesh.position.x = 700 * Math.cos( r );
    mesh.position.z = 700 * Math.sin( r );
    mesh.position.y = 700 * Math.sin( r );

    mesh.children[ 0 ].position.x = 70 * Math.cos( 2 * r );
    mesh.children[ 0 ].position.z = 70 * Math.sin( r );

    if ( activeCamera === cameraPerspective ) {

      cameraPerspective.fov = 35 + 30 * Math.sin( 0.5 * r );
      cameraPerspective.far = mesh.position.length();// 876.8418472298495, magnitude
      cameraPerspective.updateProjectionMatrix();

      cameraPerspectiveHelper.update();
      cameraPerspectiveHelper.visible = true;

      // cameraOrthoHelper.visible = false;

    } else {

      // cameraOrtho.far = mesh.position.length();
      // cameraOrtho.updateProjectionMatrix();

      // cameraOrthoHelper.update();
      // cameraOrthoHelper.visible = true;

      cameraPerspectiveHelper.visible = false;

    }

    cameraRig.lookAt( mesh.position );

    renderer.clear();// 做了什么？

    activeHelper.visible = false;

    renderer.setViewport( 0, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT );
    renderer.render( scene, activeCamera );

    activeHelper.visible = true;

    renderer.setViewport( SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT );
    renderer.render( scene, camera );

  }

  animate();



  window.addEventListener('resize', onWindowResize);
  function onWindowResize() {// can not be a arrow function

    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;
    aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

    stats.dom.style.left = window.innerWidth - 100 + 'px';


    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

    camera.aspect = 0.5 * aspect;
    camera.updateProjectionMatrix();

    cameraPerspective.aspect = 0.5 * aspect;
    cameraPerspective.updateProjectionMatrix();

    // cameraOrtho.left = - 0.5 * frustumSize * aspect / 2;
    // cameraOrtho.right = 0.5 * frustumSize * aspect / 2;
    // cameraOrtho.top = frustumSize / 2;
    // cameraOrtho.bottom = - frustumSize / 2;
    // cameraOrtho.updateProjectionMatrix();

  }

  return {c: camera, r: renderer}
}

export const doubleCamera = (scene, sceneRef) => {
    let SCREEN_WIDTH = window.innerWidth;
    let SCREEN_HEIGHT = window.innerHeight;
    let aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    const frustumSize = 600;

    // scene
    // camera
    const camera = new THREE.PerspectiveCamera( 50, 0.5 * aspect, 1, 10000 );// 观看 另外两个 camera 的camera
    camera.position.z = 2500;
    // PerspectiveCamera( fov : Number, aspect : Number, near : Number, far : Number )
    let cameraPerspective = new THREE.PerspectiveCamera( 50, 0.5 * aspect, 150, 1000 );
    let cameraPerspectiveHelper = new THREE.CameraHelper( cameraPerspective );
    scene.add(cameraPerspectiveHelper);

    //
    // OrthographicCamera( left : Number, right : Number, top : Number, bottom : Number, near : Number, far : Number )
    let cameraOrtho = new THREE.OrthographicCamera(0.5 * frustumSize * aspect / - 2, 0.5 * frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 150, 1000);
    // CameraHelper： This helps with visualizing what a camera contains in its frustum. It visualizes the frustum of a camera using a LineSegments.
    let cameraOrthoHelper = new THREE.CameraHelper( cameraOrtho );
    scene.add(cameraOrthoHelper);

    //
    let activeCamera = cameraPerspective;
    let activeHelper = cameraPerspectiveHelper;

    // counteract different front orientation of cameras vs rig
    // cameraOrtho.rotation.y = Math.PI;
    cameraPerspective.rotation.y = Math.PI;

    let cameraRig = new THREE.Group();
    cameraRig.add( cameraPerspective );
    cameraRig.add( cameraOrtho );

    scene.add(cameraRig);

    // entity
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry( 100, 16, 8 ),
      new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } )
    );
    scene.add( mesh );

    const mesh2 = new THREE.Mesh(
      new THREE.SphereGeometry( 50, 16, 8 ),
      new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } )
    );
    mesh2.position.y = 150;
    mesh.add( mesh2 );

    const mesh3 = new THREE.Mesh(
      new THREE.SphereGeometry( 5, 16, 8 ),
      new THREE.MeshBasicMaterial( { color: 0x0000ff, wireframe: true } )
    );
    mesh3.position.z = 150;
    cameraRig.add(mesh3);

    //
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < 10000; i++) {
      // THREE.MathUtils.randFloatSpread： Random float from <-range/2, range/2> interval
      vertices.push( THREE.MathUtils.randFloatSpread( 2000 ) ); // x
      vertices.push( THREE.MathUtils.randFloatSpread( 2000 ) ); // y
      vertices.push( THREE.MathUtils.randFloatSpread( 2000 ) ); // z
    }
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    const particles = new THREE.Points( geometry, new THREE.PointsMaterial( { color: 0x888888 } ) );
    scene.add( particles );

    // render
    //
    let renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    // container.appendChild( renderer.domElement );
    sceneRef.current?.appendChild(renderer.domElement);

    renderer.autoClear = false;

    // test
    // test

    //

    let stats = new Stats();
    stats.dom.style.left = window.innerWidth - 100 + 'px';
    sceneRef.current?.appendChild(stats.dom);

    // animation
    const animate = function () {
      requestAnimationFrame( animate );

      render();
      stats.update();
    };

    function render() {

      const r = Date.now() * 0.0005;

      mesh.position.x = 700 * Math.cos( r );
      mesh.position.z = 700 * Math.sin( r );
      mesh.position.y = 700 * Math.sin( r );

      mesh.children[ 0 ].position.x = 70 * Math.cos( 2 * r );
      mesh.children[ 0 ].position.z = 70 * Math.sin( r );


      cameraRig.lookAt( mesh.position );

      renderer.clear();// :

      activeHelper.visible = false;

      renderer.setViewport( 0, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT );
      renderer.render( scene, activeCamera );

      activeHelper.visible = true;

      renderer.setViewport( SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT );
      renderer.render( scene, camera );

    }

    animate();

    return {c: camera, r: renderer}
}