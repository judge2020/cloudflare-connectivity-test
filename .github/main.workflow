workflow "Push" {
  on = "push"
  resolves = ["Push-build vue"]
}

action "Push-install dependencies" {
  uses = "actions/npm@master"
  args = "ci"
}

action "Push-build vue" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Push-install dependencies"]
  args = "run build"
}
