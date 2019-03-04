workflow "Dangerfile JS Pull" {
  on = "pull_request"
  resolves = "Danger JS"
}

workflow "Dangerfile JS Label" {
  on = "label"
  resolves = "Danger JS"
}

action "Danger JS" {
  uses = "danger/danger-js@master"
  secrets = ["GITHUB_TOKEN"]
  args = "--dangerfile .ci/danger/dangerfile.ts"
}

workflow "Trigger TeamCity on review" {
  on = "pull_request_review"
  resolves = "Trigger TeamCity Build"
}

workflow "Trigger TeamCity on label" {
  on = "label"
  resolves = "Trigger TeamCity Build"
}

action "Trigger TeamCity Build" {
  uses = "docker://node"
  runs = "node scripts/teamcity-trigger-build.js"
  secrets = ["TEAMCITY_USERNAME", "TEAMCITY_PASSWORD"]
}
