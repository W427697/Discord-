FROM node:10

LABEL "com.github.actions.name"="Integration"
LABEL "com.github.actions.description"="Run an storybook example and assert it's working with puppeteer"
LABEL "com.github.actions.icon"="mic"
LABEL "com.github.actions.color"="purple"

LABEL "repository"="http://github.com/storybooks/storybook"
LABEL "homepage"="http://github.com/storybooks/storybook"
LABEL "maintainer"="Norbert de Langen <ndelangen@me.com>"
RUN ls -al
RUN du -sch *

ENTRYPOINT ["node", "./scripts/integration.js"]
