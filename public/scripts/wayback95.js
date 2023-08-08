const w95windows = [];
const w95windowsByAppName = {};

const mouse = {x: 0, y: 0, held: {is: false, update: (e)=>{}}};

let topIndex = 0;

window.ontouchmove = window.onmousemove = (e) => {
    mouse.x = e.clientX ?  e.clientX : e.changedTouches ? e.changedTouches[0].clientX : mouse.x;
    mouse.y = e.clientY ?  e.clientY : e.changedTouches ? e.changedTouches[0].clientY : mouse.y;

    if(mouse.held.is) {
        e.preventDefault();
        mouse.held.update(e);
    }
};
window.ontouchend = window.ontouchcancel = window.onmouseup = (e) => {
    mouse.held.is = false;
};

const windows = document.querySelectorAll(".window");

const stagger = {x: 5, y: 5, z: 1, xi: 60, yi: 40, zi: 1, index: 0};

for(let i = 0; i < windows.length; i++) {
    const win = windows[i];
    
    const minw = +win.getAttribute("min-width");
    const minh = +win.getAttribute("min-height");

    const startw = (win.getAttribute("start-width") ? +win.getAttribute("start-width") : minw);
    const starth = (win.getAttribute("start-height") ? +win.getAttribute("start-height") : minh);

    const closed = win.getAttribute("closed") != null;
    console.log(closed)

    const appName = win.getAttribute("app-name");

    w95windows.push({
        window: win,
        appName: appName,
        launch: null,
        maximise: null,
        exit: null,
        moveBar: document.createElement("div"),
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
        menuButtons: {
            close: null,
            maximise: null,
            hide: null
        },
        maximised: false,
        hidden: false,
        closed: closed,
        x: stagger.x,
        y: stagger.y,
        z: stagger.z,
        w: startw,
        h: starth,
        minw: minw,
        minh: minh,
        // this is the public / user defined section
        // any custom window state goes here, it should be deleted upon the window's closure and reeinitialised when it's recreated
        // yes this is slowly starting to resemble some really really weird kind of a web framework >:3
        // _state: {},
        _begin: ()=>{},
        _clean: ()=>{},
        // after the user defines all the user defined balues, they should call this
        defined: null
    });

    stagger.x += stagger.xi;
    stagger.y += stagger.yi;
    stagger.z += stagger.zi;
    stagger.index += 1;
    
    const windata = w95windows[w95windows.length - 1];

    topIndex = windata.z;

    w95windowsByAppName[appName] = windata;

    const menuButtons = windata.window.getElementsByClassName("button menu");
    for(const button of menuButtons) {
        const action = button.getAttribute("action");
        windata.menuButtons[action] = button;
    }

    windata.moveBar.className = "edge edge-move";

    windata.edges.left.className = "edge edge-vert";
    windata.edges.right.className = "edge edge-vert";
    windata.edges.top.className = "edge edge-hori";
    windata.edges.bottom.className = "edge edge-hori";

    windata.corners.left_top.className = "edge edge-diag1";
    windata.corners.right_bottom.className = "edge edge-diag1";
    windata.corners.right_top.className = "edge edge-diag2";
    windata.corners.left_bottom.className = "edge edge-diag2";

    windata.window.appendChild(windata.moveBar);

    windata.window.appendChild(windata.edges.left);
    windata.window.appendChild(windata.edges.right);
    windata.window.appendChild(windata.edges.top);
    windata.window.appendChild(windata.edges.bottom);

    windata.window.appendChild(windata.corners.left_top);
    windata.window.appendChild(windata.corners.right_bottom);
    windata.window.appendChild(windata.corners.right_top);
    windata.window.appendChild(windata.corners.left_bottom);


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
            `position:fixed; left: ${windata.x}px; top: ${windata.y}px; width: ${windata.w}px; height: ${windata.h}px; z-index: ${z_index}; display: ${(windata.closed || windata.hidden ? "none" : "initial")};`;
        
        windata.moveBar.style = 
            `position:fixed; left: ${preparedx}px; top: ${preparedy}px; width: ${preparedw - windowbuttoncount * 21 - 1}px; height: ${28}px; z-index: ${z_index+1};`;

        windata.edges.left.style = 
            `position:fixed; left: ${preparedx}px; top: ${preparedy}px; width: ${girth}px; height: ${preparedh}px; z-index: ${z_index+2};`;
        windata.edges.right.style = 
            `position:fixed; left: ${preparedx + preparedw}px; top: ${preparedy}px; width: ${girth}px; height: ${preparedh}px; z-index: ${z_index+2};`;
        windata.edges.top.style = 
            `position:fixed; left: ${preparedx}px; top: ${preparedy}px; width: ${preparedw}px; height: ${girth}px; z-index: ${z_index+2};`;
        windata.edges.bottom.style = 
            `position:fixed; left: ${preparedx}px; top: ${preparedy + preparedh}px; width: ${preparedw}px; height: ${girth}px; z-index: ${z_index+2};`;

        windata.corners.left_top.style = 
            `position:fixed; left: ${preparedx}px; top: ${preparedy}px; width: ${girth}px; height: ${girth}px; z-index: ${z_index+3};`;
        windata.corners.right_top.style = 
            `position:fixed; left: ${preparedx + preparedw}px; top: ${preparedy}px; width: ${girth}px; height: ${girth}px; z-index: ${z_index+3};`;
        windata.corners.left_bottom.style = 
            `position:fixed; left: ${preparedx}px; top: ${preparedy + preparedh}px; width: ${girth}px; height: ${girth}px; z-index: ${z_index+3};`;
        windata.corners.right_bottom.style = 
            `position:fixed; left: ${preparedx + preparedw}px; top: ${preparedy + preparedh}px; width: ${girth}px; height: ${girth}px; z-index: ${z_index+3};`;
    };

    // implementing logic behind menu buttons
    const preMaxSize = {x:windata.x,y:windata.y,w:windata.w,h:windata.h};
    windata.maximise = (max) => {
        if(max) {
            preMaxSize.x = windata.x;
            preMaxSize.y = windata.y;
            preMaxSize.w = windata.w;
            preMaxSize.h = windata.h;
            windata.x = 1;
            windata.y = 1;
            windata.w = window.innerWidth - 4;
            windata.h = window.innerHeight - 37 - 5;
            if(windata.menuButtons.maximise) windata.menuButtons.maximise.children[0].innerText = "▣";
            windata.maximised = true;
        }
        else {
            windata.x = preMaxSize.x;
            windata.y = preMaxSize.y;
            windata.w = preMaxSize.w;
            windata.h = preMaxSize.h;
            if(windata.menuButtons.maximise) windata.menuButtons.maximise.children[0].innerText = "☐";
            windata.maximised = false;
        }
        winUpdate();
    };
    windata.exit = () => {
        windata.closed = true;
        windata._clean();
        winUpdate();
    };

    // implementing menu buttons
    if(windata.menuButtons.hide) {
        windata.menuButtons.hide.onclick = () => {
            windata.hidden = true;
            winUpdate();
        };
    }
    if(windata.menuButtons.maximise) {
        windata.menuButtons.maximise.onclick = () => {
            windata.maximise(!windata.maximised);
        };
    }
    if(windata.menuButtons.close) {
        windata.menuButtons.close.onclick = () => {
            windata.exit();
        };
    } 

    windata.defined = () => {
        if(!windata.closed) {
            windata._begin();
            winUpdate();
        }
    };

    const addEdgeMouseHandler = (edge, handler, cursor) => {
        edge.onmousedown = edge.ontouchstart = (e) => {
            e.preventDefault();
            
            mouse.x = e.clientX ?  e.clientX : e.changedTouches[0].clientX;
            mouse.y = e.clientY ?  e.clientY : e.changedTouches[0].clientY;
            
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
    
    addEdgeMouseHandler(windata.moveBar, (cachebeginning) => {
        if(windata.maximised) {
            windata.menuButtons.maximise.onclick();
            cachebeginning.x = mouse.x - (windata.w / 2);
        }
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

    // launching apps
    windata.launch = () => {
        if(windata.closed) {
            windata.closed = false;
            windata.hidden = false;
            windata.maximise(false);

            windata.x = 15;
            windata.y = 15;
            windata.w = startw;
            windata.h = starth;
            
            windata._begin();
        }
        else if(windata.hidden) {
            windata.hidden = false;
        }

        topIndex += 1;
        windata.z = topIndex;

        winUpdate();
    };

    const icons = document.getElementsByClassName("icon");
    for(const icon of icons) {
        const iconAppName = icon.getAttribute("app-name");
        const iconAppId = icon.getAttribute("app-id");

        const appToLaunch = (
            (iconAppId != null) ? (w95windows[+iconAppId]) : 
            (iconAppName != null) ? (w95windowsByAppName[iconAppName]) : null);
        
        if(appToLaunch != null) {
            icon.onclick = () => {
                appToLaunch.launch();
            };
        } 
    }
}