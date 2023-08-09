(()=>{
    const app = w95windowsByAppName["Counter"];

    const begin = () => {
        console.log("heja!");
    };

    const clean = () => {
        console.log("pa pa!");
    };

    app._begin = begin;
    app._clean = clean;

    app.defined();


})();