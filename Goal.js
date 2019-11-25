class Goal {
  constructor(value, parent) {
    this.value = value;
    this.steps = [];
    this.parent = parent;
  }

  addStep(step, index=this.steps.length+1) {
    this.steps.splice(index, 0, new Goal(step, this));
    return index;
  }

  addSiblingStep(step, index) {
    this.parent.addStep(step, index);
  }

  parseToJSON() {
    var json = {goal: this.value, steps: [], collapsed: !!this.collapsed};
    var steps = this.steps;
    for (var i = 0; i < steps.length; i++) {
      json.steps.push(steps[i].parseToJSON());
    }
    return json;
  }

  deleteChild(i) {
    this.steps.splice(i, 1);
  }
}
