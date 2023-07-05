let gl, program;
let vertexCount = 36;
let modelViewMatrix;
let theta = 0;
let factorOfZoom = 0.2;
let DifferentViews = 'f';
let eye = [0, 0, 0.1];
let at = [0, 0, 0];
let up = [0, 1, 0];

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

function handleKeyDown(event) {
    if (event.key === 't') {
        DifferentViews = 't';
    } else if (event.key === 'l') {
        DifferentViews = 'l';
    } else if (event.key === 'f') {
        DifferentViews = 'f';
    } else if (event.key === 'd') {
        rotateCameraClockwise();
    } else if (event.key === 'a') {
        rotateCameraCounterClockwise();
    } else if (event.key === 'w') {
        zoomIn();
    } else if (event.key === 's') {
        zoomOut();
    } else if (event.key === 'i') {
        DifferentViews = 'i';
    }
}

function rotateCameraClockwise() {
    theta -= 11; // rotation angle
}

function rotateCameraCounterClockwise() {
    theta += 11;
}
// changed it how it is as iin zoomOut
function zoomIn() {
    factorOfZoom += 0.01;
    if (factorOfZoom > 3.0) {
        factorOfZoom = 3.0;
    }
}

function zoomOut() {
    factorOfZoom -= 0.01;
    if (factorOfZoom < 0.1) {
        factorOfZoom = 0.1;
    }
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let mvm;
    let rotationfactor = [0, 0, 0]; // just axis for rotation
    let TopEye = [0, 1, 0];
    let TopUp = [1, 0, 0];
    let FrontEye = [0, 0, 1];
    let FrontUp = [0, 1, 0];
    let LeftEye = [-1, 0, 0];
    let LeftUp = [0, 1, 0];
    let isoView_eye = [0.6, 0.6, 0.6]; // this var is for izometric
    let isoView_up = [0, 1, 0]; // this var is for izometric

    if (DifferentViews === 't') {
        mvm = lookAt(TopEye, at, TopUp);
        rotationfactor = [0, 1, 0];  // we use y for top rotation
    } else if (DifferentViews === 'l') {
        mvm = lookAt(LeftEye, at, LeftUp);
        rotationfactor = [-1, 0, 0];  // we use x but -x cause eye is also -x
    } else if (DifferentViews === 'f') {
        mvm = lookAt(FrontEye, at, FrontUp);
        rotationfactor = [0, 0, 1]; // here z for front
    } else if (DifferentViews === 'i') {
        mvm = lookAt(isoView_eye, at, isoView_up); // isometric view
        rotationfactor = [0, 1, 0]; 
    }

    mvm = mult(mvm, rotate(theta, rotationfactor)); // camera rotation with rotation matrix and model view

    // in task 2 it was for orhographic
    // now this is how it is written for prespective
    // in task 4 just pres I and pres o and p continuesly u will see the difference
    let aspect = gl.canvas.width / gl.canvas.height;
    let fov = 45; // field of view (degree)
    let near = 0.1;
    let far = 100.0;
    let projMatrix = perspective(fov, aspect, near, far);

    mvm = mult(projMatrix, mvm);
    mvm = mult(mvm, scalem(factorOfZoom, factorOfZoom, factorOfZoom)); // w and s works

    gl.uniformMatrix4fv(modelViewMatrix, false, flatten(mvm));

    gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_BYTE, 0);

    requestAnimationFrame(render);
}
