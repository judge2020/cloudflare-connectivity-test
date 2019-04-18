workflow "Push" {
  on = "push"
  resolves = ["Push-build vue"]
}

action "Push-install dependencies" {
  uses = "actions/npm@master"
  args = "ci"
}

action "Push-build vue" {
  uses = "actions/npm@master"
  needs = ["Push-install dependencies"]
  args = "run build"
}
