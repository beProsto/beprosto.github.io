const w95windows = [];

const mouse = {x: 0, y: 0, held: {is: false, update: (e)=>{}}};

window.onmousemove = (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    if(mouse.held.is) {
        mouse.held.update(e);
    }
};
window.onmouseup = (e) => {
    mouse.held.is = false
};

window.addEventListener("load", () => {
    const windows = document.querySelectorAll(".window");
  
    const stagger = {x: 5, y: 5, xi: 60, yi: 40};

    for(const win of windows) {
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
            w: 500,
            h: 300
        });

        stagger.x += stagger.xi;
        stagger.y += stagger.yi;

        const windata = w95windows[w95windows.length - 1];

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

        const winupdate = () => {
            windata.window.style = 
                `position:absolute; left: ${windata.x}px; top: ${windata.y}px; width: ${windata.w}px; height: ${windata.h}px;`;
            
            windata.movebar.style = 
                `position:absolute; left: ${windata.x}px; top: ${windata.y}px; width: ${windata.w}px; height: ${23}px;`;
            

            windata.edges.left.style = 
                `position:absolute; left: ${windata.x}px; top: ${windata.y}px; width: ${4}px; height: ${windata.h}px;`;
            windata.edges.right.style = 
                `position:absolute; left: ${windata.x + windata.w}px; top: ${windata.y}px; width: ${4}px; height: ${windata.h}px;`;
            windata.edges.top.style = 
                `position:absolute; left: ${windata.x}px; top: ${windata.y}px; width: ${windata.w}px; height: ${4}px;`;
            windata.edges.bottom.style = 
                `position:absolute; left: ${windata.x}px; top: ${windata.y + windata.h}px; width: ${windata.w}px; height: ${4}px;`;
    
            windata.corners.left_top.style = 
                `position:absolute; left: ${windata.x}px; top: ${windata.y}px; width: ${4}px; height: ${4}px;`;
            windata.corners.right_top.style = 
                `position:absolute; left: ${windata.x + windata.w}px; top: ${windata.y}px; width: ${4}px; height: ${4}px;`;
            windata.corners.left_bottom.style = 
                `position:absolute; left: ${windata.x}px; top: ${windata.y + windata.h}px; width: ${4}px; height: ${4}px;`;
            windata.corners.right_bottom.style = 
                `position:absolute; left: ${windata.x + windata.w}px; top: ${windata.y + windata.h}px; width: ${4}px; height: ${4}px;`;
        };

        const addEdgeMouseHandler = (edge, handler) => {
            edge.onmousedown = () => {
                mouse.held.is = true;
                const cachebeginning = 
                    {x: windata.x, y: windata.y, w: windata.w, h: windata.h, mx: mouse.x, my: mouse.y}; 
                
                mouse.held.update = (e) => {
                    handler(cachebeginning);
                    winupdate();
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

        winupdate();
    }
});