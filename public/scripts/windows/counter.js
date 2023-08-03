(()=>{

    const app = w95windowsByAppName["Counter"];

    const state = {count: 0};

    const begin = () => {
        const update = () => {
            app.window.children[0].children[0].innerText = `the count is ${state.count}`;
        };
        
        update();
        
        app.window.querySelector(".body").querySelector("button").onclick = () => {
            state.count += 1;
            update();
        };
        console.log("heja!");
    };

    const clean = () => {
        state.count = 0;
        console.log("pa pa!");
    };

    app._begin = begin;
    app._clean = clean;

    app.defined();


})();