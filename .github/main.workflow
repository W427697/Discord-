workflow "Example action with shell" {
  on = "push"
  resolves = ["EXAMPLE ACTION"]
}

action "EXAMPLE ACTION" {
  uses = "./ci/action-a"
  env = {
    MY_NAME = "Mona"
  }
  args = "\"Hello world, I'm $MY_NAME!\""
}

workflow "Publish on Netlify" {
  on = "push"
  resolves = ["Publish Official Example"]
}

action "Publish Official Example" {
  uses = "netlify/actions/build@master"
  secrets = ["GITHUB_TOKEN", "NETLIFY_SITE_ID"]
  env = {
    BUILD_CONTEXT = "OFFICIAL"
    NETLIFY_CMD = "bash scripts/netlify-build.sh"
    NETLIFY_DIR = "netlify-build"
  }
}
