let gl, program;
let vertexCount = 36;
let modelViewMatrix;

let eye = [0, 0, 0.1];
let at = [0, 0, 0];
let up = [0, 1, 0];

let theta = 0; // rotation angle

let DifferentViews = 'T'; // view mode (top-side view for t) I just add this to use it in render with the help of if else

onload = () => {
  let canvas = document.getElementById("webgl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert('No webgl for you');
    return;
  }

  program = initShaders(gl, 'vertex-shader', 'fragment-shader');
  gl.useProgram(program);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.enable(gl.DEPTH_TEST);

  gl.clearColor(0, 0, 0, 0.5);

  let vertices = [
    -1, -1, 1,
    -1, 1, 1,
    1, 1, 1,
    1, -1, 1,
    -1, -1, -1,
    -1, 1, -1,
    1, 1, -1,
    1, -1, -1,
  ];

  let indices = [
    0, 3, 1,
    1, 3, 2,
    4, 7, 5,
    5, 7, 6,
    3, 7, 2,
    2, 7, 6,
    4, 0, 5,
    5, 0, 1,
    1, 2, 5,
    5, 2, 6,
    0, 3, 4,
    4, 3, 7,
  ];

  let colors = [
    0, 0, 0,
    0, 0, 1,
    0, 1, 0,
    0, 1, 1,
    1, 0, 0,
    1, 0, 1,
    1, 1, 0,
    1, 1, 1,
  ];

  // You should get rid of the line below eventually
  // I did not delete this in first task cause cube block whole window
  
  vertices = scale(0.5, vertices);

  let vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  let vPosition = gl.getAttribLocation(program, 'vPosition');
  gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  let iBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

  let cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  let vColor = gl.getAttribLocation(program, 'vColor');
  gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  modelViewMatrix = gl.getUniformLocation(program, 'modelViewMatrix');

  document.addEventListener('keydown', handleKeyDown);

  render();
};

// here is my if else for DifferentViews. It changes its values then we use it in render()
function handleKeyDown(event) {
  if (event.key === 'T' || event.key === 't') {
    DifferentViews = 'T';
  } else if (event.key === 'L' || event.key === 'l') {
    DifferentViews = 'L';
  } else if (event.key === 'F' || event.key === 'f') {
    DifferentViews = 'F';
  } else if (event.key === 'D' || event.key === 'd') {
    rotateCameraClockwise();
  } else if (event.key === 'A' || event.key === 'a') {
    rotateCameraCounterClockwise();
  }
}
// this is for rotating camera 11 is not good choice but u can change it.
function rotateCameraClockwise() {
  theta -= 11; //rotaotion angle
}

function rotateCameraCounterClockwise() {
  theta += 11;
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  let mvm;
  let rotationAxis = [0, 0, 0]; //just axis for rotation

  // those values are for different keywords. EX: top is for t Front is for f, Left is for l. Values to get sides of cube

  let TopEye = [0, 1, 0]; 
  let TopUp = [1, 0, 0];
  let FrontEye = [0, 0, 1]; 
  let FrontUp = [0, 1, 0];
  let LeftEye = [-1, 0, 0]; 
  let LeftUp = [0, 1, 0];

  // here we used those values as it is written above in if else
  // 1 important point here. we can use 1 rotation matrix
  // but it will not rotate camera in every views of sides
  // as a solution I just changes x,y,z values of rotation matrix

  if (DifferentViews === 'T') {
    mvm = lookAt(TopEye, at, TopUp); 
    rotationAxis = [0, 1, 0]; // we use y for top rotation
  } else if (DifferentViews === 'L') {
    mvm = lookAt(LeftEye, at, LeftUp ); 
    rotationAxis = [-1, 0, 0]; // we use x but -x cause eye is also -x
  } else if (DifferentViews === 'F') {
    mvm = lookAt(FrontEye, at, FrontUp); 
    rotationAxis = [0, 0, 1] // here z for front
  }

  mvm = mult(mvm, rotate(theta, rotationAxis)); //camera rotation with rotation matrix and model view

  gl.uniformMatrix4fv(modelViewMatrix, false, flatten(mvm));

  gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_BYTE, 0);

  requestAnimationFrame(render);
}
