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

        const minw = +windata.window.getAttribute("min-width");
        const minh = +windata.window.getAttribute("min-height");

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
            const offsetx = -4;
            const offsety = -4;
            const offsetw = 4;
            const offseth = 4;
            const girth = 6;

            const preparedx = windata.x + offsetx;
            const preparedy = windata.y + offsety;
            const preparedw = windata.w + offsetw;
            const preparedh = windata.h + offseth;

            const windowbuttoncount = windata.window.children[0].children.length - 1; 
            
            
            windata.window.style = 
                `position:absolute; left: ${windata.x}px; top: ${windata.y}px; width: ${windata.w}px; height: ${windata.h}px; z-index: ${z_index};`;
            
            windata.movebar.style = 
                `position:absolute; left: ${preparedx}px; top: ${preparedy}px; width: ${preparedw - windowbuttoncount * 21 - 1}px; height: ${28}px; z-index: ${z_index+1};`;
            

            windata.edges.left.style = 
                `position:absolute; left: ${preparedx}px; top: ${preparedy}px; width: ${girth}px; height: ${preparedh}px; z-index: ${z_index+2};`;
            windata.edges.right.style = 
                `position:absolute; left: ${preparedx + preparedw}px; top: ${preparedy}px; width: ${girth}px; height: ${preparedh}px; z-index: ${z_index+2};`;
            windata.edges.top.style = 
                `position:absolute; left: ${preparedx}px; top: ${preparedy}px; width: ${preparedw}px; height: ${girth}px; z-index: ${z_index+2};`;
            windata.edges.bottom.style = 
                `position:absolute; left: ${preparedx}px; top: ${preparedy + preparedh}px; width: ${preparedw}px; height: ${girth}px; z-index: ${z_index+2};`;
    
            windata.corners.left_top.style = 
                `position:absolute; left: ${preparedx}px; top: ${preparedy}px; width: ${girth}px; height: ${girth}px; z-index: ${z_index+3};`;
            windata.corners.right_top.style = 
                `position:absolute; left: ${preparedx + preparedw}px; top: ${preparedy}px; width: ${girth}px; height: ${girth}px; z-index: ${z_index+3};`;
            windata.corners.left_bottom.style = 
                `position:absolute; left: ${preparedx}px; top: ${preparedy + preparedh}px; width: ${girth}px; height: ${girth}px; z-index: ${z_index+3};`;
            windata.corners.right_bottom.style = 
                `position:absolute; left: ${preparedx + preparedw}px; top: ${preparedy + preparedh}px; width: ${girth}px; height: ${girth}px; z-index: ${z_index+3};`;
        };

        const addEdgeMouseHandler = (edge, handler) => {
            edge.onmousedown = (e) => {
                e.preventDefault();
                mouse.held.is = true;
                const cachebeginning = 
                    {x: windata.x, y: windata.y, w: windata.w, h: windata.h, mx: mouse.x, my: mouse.y}; 
                
                topIndex += 1;
                windata.z = topIndex;
                winUpdate();

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
            let changedx = mouse.x;
            let changedw = cachebeginning.w - mouse.x + cachebeginning.x;
            if(changedw < minw) {
                changedx = cachebeginning.x + cachebeginning.w - minw;
                changedw = minw;
            } 
            windata.x = changedx;
            windata.w = changedw;
        });
        addEdgeMouseHandler(windata.edges.right, (cachebeginning) => {
            let changedw = mouse.x - cachebeginning.x;
            if(changedw < minw) {
                changedw = minw;
            }
            windata.w = changedw;
        });
        addEdgeMouseHandler(windata.edges.top, (cachebeginning) => {
            let changedy = mouse.y;
            let changedh = cachebeginning.h - mouse.y + cachebeginning.y;
            if(changedh < minh) {
                changedy = cachebeginning.y + cachebeginning.h - minh;
                changedh = minh;
            }
            windata.y = changedy;
            windata.h = changedh;
        });
        addEdgeMouseHandler(windata.edges.bottom, (cachebeginning) => {
            let changedh = mouse.y - cachebeginning.y;
            if(changedh < minh) {
                changedh = minh;
            }
            windata.h = changedh;
        });

        addEdgeMouseHandler(windata.corners.left_top, (cachebeginning) => {
            let changedx = mouse.x;
            let changedy = mouse.y;
            let changedw = cachebeginning.w - mouse.x + cachebeginning.x;
            let changedh = cachebeginning.h - mouse.y + cachebeginning.y;
            if(changedw < minw) {
                changedx = cachebeginning.x + cachebeginning.w - minw;
                changedw = minw;
            }
            if(changedh < minh) {
                changedy = cachebeginning.y + cachebeginning.h - minh;
                changedh = minh;
            }
            windata.x = changedx;
            windata.y = changedy;
            windata.w = changedw;
            windata.h = changedh;
        });
        addEdgeMouseHandler(windata.corners.right_top, (cachebeginning) => {
            let changedy = mouse.y;
            let changedw = mouse.x - cachebeginning.x;
            let changedh = cachebeginning.h - mouse.y + cachebeginning.y;
            if(changedw < minw) {
                changedw = minw;
            }
            if(changedh < minh) {
                changedy = cachebeginning.y + cachebeginning.h - minh;
                changedh = minh;
            }
            windata.y = changedy;
            windata.w = changedw;
            windata.h = changedh;
        });
        addEdgeMouseHandler(windata.corners.left_bottom, (cachebeginning) => {
            let changedx = mouse.x;
            let changedw = cachebeginning.w - mouse.x + cachebeginning.x;
            let changedh = mouse.y - cachebeginning.y;
            if(changedw < minw) {
                changedx = cachebeginning.x + cachebeginning.w - minw;
                changedw = minw;
            }
            if(changedh < minh) {
                changedh = minh;
            }
            windata.x = changedx;
            windata.w = changedw;
            windata.h = changedh;
        });
        addEdgeMouseHandler(windata.corners.right_bottom, (cachebeginning) => {
            let changedw = mouse.x - cachebeginning.x;
            let changedh = mouse.y - cachebeginning.y;
            if(changedw < minw) {
                changedw = minw;
            }
            if(changedh < minh) {
                changedh = minh;
            }
            windata.w = changedw;
            windata.h = changedh;
        });

        winUpdate();
    }
});