// NOTE: here I wrote then delete in infinte times this code so will not add comments for lines of previous tasks
// the hardes task took my 3 days)
// but then I recognized it is really simple
// just take task 2 and taks 3
// add more vertices then translate vertices for scnd cube
// for switch btwn Ortho and Pers used if else for their mvm matrix in render
let gl, program;
let vertexCount = 0;
let modelViewMatrix;
let theta = 0;
let factorOfZoom = 0.4;
let DifferentViews = 'f';
// added viewChange to change it to pers and ortho views.
// as a default it is Ortho 
// we will use this var in if else handlekey to change it (value) to p or o
// then we use that val in render to get it
let viewChange = 'o';
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

       
        8, 11, 9,
        9, 11, 10,
        12, 15, 13,
        13, 15, 14,
        11, 15, 10,
        10, 15, 14,
        12, 8, 13,
        13, 8, 9,
        9, 10, 13,
        13, 10, 14,
        8, 11, 12,
        12, 11, 15,
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

        0, 0.6, 0,
        0, 1, 0,
        0, 1, 0,
        1, 0, 1,
        0, 1, 1,
        0, 0, 1,
        1, 0, 0,
        0, 1, 1,
    ];

    vertexCount = (indices.length)/2;

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

// added o and p here to be able to use keybord to change val of viewChange
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
    } else if (event.key === 'o') {
      viewChange = 'o';
      render();
    } else if (event.key === 'p') {
      viewChange = 'p';
      render();
    }
  }
  
  
  
  

function rotateCameraClockwise() {
    theta -= 11; // rotation angle
}

function rotateCameraCounterClockwise() {
    theta += 11;
}

function zoomIn() {
    factorOfZoom += 0.01;
    if (factorOfZoom > 3.0) {
        factorOfZoom = 3.0;
    }
}

function zoomOut() {
    factorOfZoom -= 0.01;
    if (factorOfZoom < 0.08) {
        factorOfZoom = 0.08;
    }
}
// here I did it in 1 vertice, color, indices variable. but it is possible do add many variables for them and use this function.
function generateCube(vertices) {
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
}


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let mvm;
    let rotationfactor = [0, 0, 0];
    let TopEye = [0, 1, 0];
    let TopUp = [1, 0, 0];
    let FrontEye = [0, 0, 1];
    let FrontUp = [0, 1, 0];
    let LeftEye = [-1, 0, 0];
    let LeftUp = [0, 1, 0];
    let isoView_eye = [2, 2, 2];
    let isoView_up = [0, 1, 0];
    let t_mat;

    if (DifferentViews === 't') {
        mvm = lookAt(TopEye, at, TopUp);
        rotationfactor = [0, 1, 0];
        t_mat = translate(3, -3, -3);
    } else if (DifferentViews === 'l') {
        mvm = lookAt(LeftEye, at, LeftUp);
        rotationfactor = [-1, 0, 0];
        t_mat = translate(3, 0, -3);
    } else if (DifferentViews === 'f') {
        mvm = lookAt(FrontEye, at, FrontUp);
        rotationfactor = [0, 0, 1];
        t_mat = translate(3, 0, -3);
    } else if (DifferentViews === 'i') {
        mvm = lookAt(isoView_eye, at, isoView_up);
        rotationfactor = [0, 1, 0];
        t_mat = translate(3, 0, -3);
    }

    mvm = mult(mvm, rotate(theta, rotationfactor));

    // NOTE: in render everything is same as int taks 3
    // but added variables of both Ortho and Pers 
    let aspect = gl.canvas.width / gl.canvas.height;
    let fov = 50;
    let left = -2.0; 
    let right = 2.0;
    let bottom = -2.0;
    let top = 2.0;
    let near = 0.1;
    let far = 100.0;
    let projMatrix; 

    // here is the everything happens (it took so much time for me to write this 6 line)
    // therefore I am late in Deadline (due to thisi 6 lines in task 4)
    

    // after ages I realised that, just changing projMatrix for condition was enough
    if(viewChange === 'o'){

      // mat for ortho
  
         projMatrix = ortho(left, right, bottom, top, near, far); 

    } else if(viewChange === 'p') {

      // mat for pers

         projMatrix = perspective(fov, aspect, near, far);
    }

    mvm = mult(projMatrix, mvm);
    mvm = mult(mvm, scalem(factorOfZoom, factorOfZoom, factorOfZoom));

    gl.uniformMatrix4fv(modelViewMatrix, false, flatten(mvm));

    
    gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_BYTE, 0);

    
    let mvm2 = mult(mvm, t_mat);
    gl.uniformMatrix4fv(modelViewMatrix, false, flatten(mvm2));
    gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_BYTE, 0);

    requestAnimationFrame(render);

}



