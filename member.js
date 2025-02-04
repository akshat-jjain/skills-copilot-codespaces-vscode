function skillsMember() {
  // Add a new method to the Member class
  this.getSkills = function() {
    return this.skills;
  };
  // Add a new method to the Member class
  this.setSkills = function(skills) {
    this.skills = skills;
  };
}