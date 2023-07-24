const w95windows = [];

const mouse = {x: 0, y: 0, held: {is: false, update: (e)=>{}}};

let topIndex = 0;

window.onmousemove = (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    if(mouse.held.is) {
        e.preventDefault();
        mouse.held.update(e);
    }
};
window.onmouseup = (e) => {
    mouse.held.is = false
};


window.addEventListener("load", () => {
    const windows = document.querySelectorAll(".window");
  
    const stagger = {x: 5, y: 5, z: 1, xi: 60, yi: 40, zi: 1, index: 0};

    for(let i = 0; i < windows.length; i++) {
        const win = windows[i];
        w95windows.push({
            window: win,
            movebar: document.createElement("div"),
            edges: {
                left: document.createElement("div"),
                right: document.createElement("div"),
                top: document.createElement("div"),
                bottom: document.createElement("div"),
            },
            corners: {
                left_top: document.createElement("div"),
                right_top: document.createElement("div"),
                left_bottom: document.createElement("div"),
                right_bottom: document.createElement("div"),
            },
            x: stagger.x,
            y: stagger.y,
            z: stagger.z,
            w: 500,
            h: 300
        });

        stagger.x += stagger.xi;
        stagger.y += stagger.yi;
        stagger.z += stagger.zi;
        stagger.index += 1;
        
        const windata = w95windows[w95windows.length - 1];

        topIndex = windata.z;

        windata.movebar.className = "edge edge-move";

        windata.edges.left.className = "edge edge-vert";
        windata.edges.right.className = "edge edge-vert";
        windata.edges.top.className = "edge edge-hori";
        windata.edges.bottom.className = "edge edge-hori";

        windata.corners.left_top.className = "edge edge-diag1";
        windata.corners.right_bottom.className = "edge edge-diag1";
        windata.corners.right_top.className = "edge edge-diag2";
        windata.corners.left_bottom.className = "edge edge-diag2";

        document.body.appendChild(windata.movebar);

        document.body.appendChild(windata.edges.left);
        document.body.appendChild(windata.edges.right);
        document.body.appendChild(windata.edges.top);
        document.body.appendChild(windata.edges.bottom);

        document.body.appendChild(windata.corners.left_top);
        document.body.appendChild(windata.corners.right_bottom);
        document.body.appendChild(windata.corners.right_top);
        document.body.appendChild(windata.corners.left_bottom);

        const winUpdate = () => {
            const z_index = windata.z * 4;
            windata.window.style = 
                `position:absolute; left: ${windata.x}px; top: ${windata.y}px; width: ${windata.w}px; height: ${windata.h}px; z-index: ${z_index};`;
            
            windata.movebar.style = 
                `position:absolute; left: ${windata.x}px; top: ${windata.y}px; width: ${windata.w}px; height: ${23}px; z-index: ${z_index+1};`;
            

            windata.edges.left.style = 
                `position:absolute; left: ${windata.x}px; top: ${windata.y}px; width: ${4}px; height: ${windata.h}px; z-index: ${z_index+2};`;
            windata.edges.right.style = 
                `position:absolute; left: ${windata.x + windata.w}px; top: ${windata.y}px; width: ${4}px; height: ${windata.h}px; z-index: ${z_index+2};`;
            windata.edges.top.style = 
                `position:absolute; left: ${windata.x}px; top: ${windata.y}px; width: ${windata.w}px; height: ${4}px; z-index: ${z_index+2};`;
            windata.edges.bottom.style = 
                `position:absolute; left: ${windata.x}px; top: ${windata.y + windata.h}px; width: ${windata.w}px; height: ${4}px; z-index: ${z_index+2};`;
    
            windata.corners.left_top.style = 
                `position:absolute; left: ${windata.x}px; top: ${windata.y}px; width: ${4}px; height: ${4}px; z-index: ${z_index+3};`;
            windata.corners.right_top.style = 
                `position:absolute; left: ${windata.x + windata.w}px; top: ${windata.y}px; width: ${4}px; height: ${4}px; z-index: ${z_index+3};`;
            windata.corners.left_bottom.style = 
                `position:absolute; left: ${windata.x}px; top: ${windata.y + windata.h}px; width: ${4}px; height: ${4}px; z-index: ${z_index+3};`;
            windata.corners.right_bottom.style = 
                `position:absolute; left: ${windata.x + windata.w}px; top: ${windata.y + windata.h}px; width: ${4}px; height: ${4}px; z-index: ${z_index+3};`;
        };

        const addEdgeMouseHandler = (edge, handler) => {
            edge.onmousedown = () => {
                mouse.held.is = true;
                const cachebeginning = 
                    {x: windata.x, y: windata.y, w: windata.w, h: windata.h, mx: mouse.x, my: mouse.y}; 
                
                topIndex += 1;
                windata.z = topIndex;

                mouse.held.update = (e) => {
                    handler(cachebeginning);
                    winUpdate();
                };
            };
        }
        
        addEdgeMouseHandler(windata.movebar, (cachebeginning) => {
            windata.x = mouse.x - cachebeginning.mx + cachebeginning.x;
            windata.y = mouse.y - cachebeginning.my + cachebeginning.y;
        });

        addEdgeMouseHandler(windata.edges.left, (cachebeginning) => {
            windata.x = mouse.x;
            windata.w = cachebeginning.w - mouse.x + cachebeginning.x;
        });
        addEdgeMouseHandler(windata.edges.right, (cachebeginning) => {
            windata.w = mouse.x - cachebeginning.x;
        });
        addEdgeMouseHandler(windata.edges.top, (cachebeginning) => {
            windata.y = mouse.y;
            windata.h = cachebeginning.h - mouse.y + cachebeginning.y;
        });
        addEdgeMouseHandler(windata.edges.bottom, (cachebeginning) => {
            windata.h = mouse.y - cachebeginning.y;
        });

        addEdgeMouseHandler(windata.corners.left_top, (cachebeginning) => {
            windata.x = mouse.x;
            windata.y = mouse.y;
            windata.w = cachebeginning.w - mouse.x + cachebeginning.x;
            windata.h = cachebeginning.h - mouse.y + cachebeginning.y;
        });
        addEdgeMouseHandler(windata.corners.right_top, (cachebeginning) => {
            windata.y = mouse.y;
            windata.w = mouse.x - cachebeginning.x;
            windata.h = cachebeginning.h - mouse.y + cachebeginning.y;
        });
        addEdgeMouseHandler(windata.corners.left_bottom, (cachebeginning) => {
            windata.x = mouse.x;
            windata.w = cachebeginning.w - mouse.x + cachebeginning.x;
            windata.h = mouse.y - cachebeginning.y;
        });
        addEdgeMouseHandler(windata.corners.right_bottom, (cachebeginning) => {
            windata.w = mouse.x - cachebeginning.x;
            windata.h = mouse.y - cachebeginning.y;
        });

        winUpdate();
    }
});