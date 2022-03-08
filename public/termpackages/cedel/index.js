// ----------
// CEDEL
// Cooper's ETHIX Desktop Environment Layer
// Written by Cooper Violette
// Development started 3/4/22
// ----------

commandManager.add("start-cedel", "Starts Cooper's ETHIX Desktop Environment Layer", "start-cedel", args => {
    terminal.log("\nCooper's ETHIX Desktop Environment Layer\nNow starting...\n");
	
	// Initialize and apply base layer
	const baseLayer = document.createElement("div");
	baseLayer.style = "position:absolute;z-index:5;width:100%;height:100%;padding:0;margin:0;";
	baseLayer.id = "baseLayer";
	document.body.appendChild(baseLayer);
	
	// Initialize and apply desktop stylesheets
	const prefSheet = document.createElement("link");
	prefSheet.rel = "stylesheet";
	prefSheet.type = "text/css";
	prefSheet.href = "/termpackages/cedel/pref.css";
	document.head.appendChild(prefSheet);


	// DEAR COOPER
	// I reccomend you use an <iframe> component to embed your desktop
	// because you can directly reference an HTML file in the iframe
	// rather than having to write all of your HTML code in the div js file
});
