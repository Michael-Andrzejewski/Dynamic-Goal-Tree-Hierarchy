// credits!
console.log("(c) Created by Andrew Yatzkan\n (c) with idea/help from GitHub.com/Soareverix\n \n", "font-family: Comic Sans MS; font-size: 1.5rem; color: skyblue;", "font-family: Comic Sans MS; font-size: 1.25rem; color: skyblue;");

const PROMPT = {
  DELETE: "Are you sure you would like to delete this item?"
}

const DEFAULT = {
  CONTENT: [new Goal("Welcome to GoalTree", god).parseToJSON()],
  VALUE: "New Goal"
}

// used to convert JSON structure to Goal objects
Goal.prototype.addSteps = function(steps) {
	for (var i = 0; i < steps.length; i++) {
		var step = steps[i];
    var index = this.addStep(step.goal) - 1;
    this.steps[i].collapsed = step.collapsed;
		this.steps[index].addSteps(step.steps);
	}
}

// contains every other Goal
var god = new Goal();

// gets data from localStorage (if none is found, use default)
var data = JSON.parse(localStorage.getItem("save")) || DEFAULT.CONTENT;

// edge-case for when every goal is removed, there are many ways to go about this
if (JSON.stringify(data) === "[]") data = DEFAULT.CONTENT;

// parse JSON data into Goal objects which are children of god
for (var i = 0; i < data.length; i++) {
	var goal = new Goal(data[i].goal, god);
	goal.addSteps(data[i].steps);
	god.steps.push(goal);
}

// save to localStorage & re-render whenever there are edits
function edited(reRender) {
  if (reRender) displaySteps();
  localStorage.setItem("save", JSON.stringify(god.parseToJSON().steps));
}

// DOM container for everything in this script
const mainContainer = document.querySelector(".container");

// display content into mainContainer, used whenever there is an edit
function displaySteps(steps=god.steps, container=mainContainer) {
  // if top level, reset the container to avoid duplicating the content
  if (container === mainContainer) container.innerHTML = "";
  for (let i = 0; i < steps.length; i++) {
    let step = steps[i];
    var element = document.createElement("div");
    element.classList.add("item");

    var titleContainer = document.createElement("div");

    var addButton = document.createElement("button");
    addButton.innerText = "+";
    addButton.addEventListener("click", e => {
      step.addSiblingStep(DEFAULT.VALUE, i + 1);
      edited(true);
    });

    var title = document.createElement("span");
    title.contentEditable = true;
    title.spellcheck = false;
    title.innerText = step.value;
    title.addEventListener("input", e => {
      step.value = e.target.innerText;
      edited();
    });

    var removeButton = document.createElement("button");
    removeButton.innerText = "-";
    removeButton.addEventListener("click", e => {
      if (!e.shiftKey && !confirm(PROMPT.DELETE)) return;
      step.parent.deleteChild(i);
      edited(true);
    });

    var collapseButton = document.createElement("button");
    collapseButton.innerHTML = step.collapsed ? "&#9654;" : "&#9660;";
    collapseButton.addEventListener("click", e => {
      step.collapsed = !step.collapsed;
      edited(true);
    });

    var childContainer = document.createElement("div");
    childContainer.style.display = step.collapsed ? "none" : "block";

    titleContainer.insertAdjacentElement("beforeend", addButton);
    titleContainer.insertAdjacentElement("beforeend", title);
    titleContainer.insertAdjacentElement("beforeend", removeButton);
    if (step.steps.length) titleContainer.insertAdjacentElement("beforeend", collapseButton);
    element.insertAdjacentElement("beforeend", titleContainer);
    element.insertAdjacentElement("beforeend", childContainer);
    container.insertAdjacentElement("beforeend", element);

    if (step.steps.length) {
	    displaySteps(step.steps, childContainer);
    } else {
	    var createSteps = document.createElement("button");
	    createSteps.innerText = "+";
	    createSteps.style.marginLeft = "4rem";
	    createSteps.addEventListener("click", e => {
		    step.addStep(DEFAULT.VALUE);
		    edited(true);
	    });
	    container.insertAdjacentElement("beforeend", createSteps);
    }
  }
}

// render the content (note: this isn't an immediately invoked function because the scope will be local without weird syntax and we want to use it in the `edited` function)
displaySteps();
