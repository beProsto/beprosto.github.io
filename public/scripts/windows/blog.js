(()=>{
    const app = w95windowsByAppName["Blog"];
    
    const state = {
        body: null,
        ctr: null,
        par: null,
        button: null,
    };

    const displayUpdate = () => {
        state.par.innerText = state.ctr;
    };

    const begin = () => {
        console.log("heja!");
        state.ctr = 0;

        state.body = app.window.getElementsByClassName("body")[0];
        
        state.par = document.getElementById("ctr");
        displayUpdate();

        state.button = state.body.getElementsByTagName("button")[0];
        state.button.onclick = () => {
            state.ctr += 1;
            displayUpdate();
        };
        

        // state.intv = setInterval(() => {
        //     state.ctr += 0.005;

        //     app.y = (Math.sin(state.ctr) * 0.5 + 0.5) * 500;
        //     app.x = (Math.cos(state.ctr) * 0.5 + 0.5) * 500;

        //     app.winUpdate();

        // }, 0.01);
        
    };

    const clean = () => {
        console.log("pa pa!");

        // clearInterval(state.intv);
    };

    app._begin = begin;
    app._clean = clean;

    app.defined();
})();