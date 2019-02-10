workflow "Dangerfile JS Pull" {
  on = "pull_request"
  resolves = "Danger JS"
}

action "Danger JS" {
  uses = "danger/danger-js@master"
  secrets = ["GITHUB_TOKEN"]
  args = "--dangerfile .ci/danger/dangerfile.ts"
}

workflow "Integrations" {
  on = "push"
  resolves = [
    "integration_cra-kitchen-sink",
  ]
}

action "integration_cra-kitchen-sink" {
  uses = "./.ci/integration/"
  args = "--example cra-kitchen-sink"
}
