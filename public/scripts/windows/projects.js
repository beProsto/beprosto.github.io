(()=>{
    const app = w95windowsByAppName["Projects"];

    const begin = () => {
        console.log("Hi! Here's your easter egg for checking out my projects! :p");
    };

    const clean = () => {
        console.log("Oh, so rude!");
    };

    app._begin = begin;
    app._clean = clean;

    app.defined();


})();