# Building better components with storybook

## intro

Writing apps is hard. 

How many times have your estimations been correct?
Where did the extra time go? 
Was the application more complex than previously envisioned?

Is de-composing your big applications into smaller applications the answer?

When we're doing this, we run the risk of creating a distributed monolith.

Is de-composing your big applications into smaller applications the answer?

Yes.

---

Thank you slide

---

My name is Norbert, I'm full-time open-source maintainer of storybook, a developer avocado at Chroma and have been building UI's for many years.
I'd like to share some of my findings working on UI's and tools.

## stories

### A nightmare story: company 1

company with 3 teams
each team working on a section of the app
the longer development continued the more the teams would have to make requests to each other
blocking each other, lots of time (and money) is wasted, tensions rise between teams.

### A nightmare story: company 2

company with 18 teams
1 team is responsible for infra
1 team is responsible for APIs
1 team is responsible for common UI
other teams are responsible for their own app

Do I even need to tell what's wrong with this?
This structure inherently creates inter-team dependencies.
3x single point of failure, large groups of people dependent on small sets of people

## learnings

What's the commonality with these 2 stories?
And what's the commonality with building apps?

> Abstraction, Isolation, Autonomy

### Abstraction

Abstracting problems is the key to good software development.
But in order to abstract correctly you must understand the problem well.
THAT is the hard part about software development.

Do not try to solve too many problems in 1 solution

If you create abstractions where you shouldn't you'll get complexity
If you don't create abstractions where you should you'll get complexity

> As developers we battle complexity

> Complexity is the name of the dragon we try to fight but also feed

### Isolation

If we do create good abstractions, the pieces become naturally isolatable.

Isolation means your piece/component is swappable for a similar component which may have a different implementation.

Isolated pieces will have some API for communication, and it's this api, the props if you will, that will determine if your component will be loved or despised.

If your component isolates too much, it's API will either have to grow to compensate for it's multitude of use-cases; increasing the complexity.
Or the component will be less re-usable, meaning long term there will be copies of the component with a slight change; increasing the complexity.

### Autonomy

If components have good APIs to interact with them, and do not abstract too much, nor too little; team using these components will not need to know or change the implementation details.

They can now focus on their own app, and do not have to wait on others or meddle with the other team's app.

## React components

They abstract a section of UI, right?

Wrong.

React components should abstract a UI pattern/concept.
This is different from "a section of visible UI".

A UI concept CAN mean it's visible, but that's not a requirement.
A well implemented UI concept should encapsulate/abstract that particular concept and nothing else.
Remember, if you abstract too much, it will likely result in complexity later.

So if the UI pattern you're implementing is like a accordion you could:

```js
<Accordion items={items} />
```

This means the accordion encapsulated how the items are rendered. This limits the re-usability of this component.
Which may be fine, but if your Accordion has multiple use-cases, it likely won't be!

When presented with other use-cases later on it's tempting to just add APIs:

```js
<Accordion items={items} horizontal={true} />
```

or slightly better:
```js
<Accordion items={items} variant={'horizontal'} />
```

But adding APIs/props to components comes with complexity, just have a look at this:
```js
const accordionItems = [
  {
    title: '🐴',
    openTitle: '🐎',
    contents: '...',
    disabled: false,
  },
  // ...
]

const ui = (
  <Accordion
    items={items}
    position="below"
    single={true}
    preventClose={true}
    openTrigger="focus"
    closeTrigger="blur"
    titleClassName="acc-title"
    contentsClassName="acc-contents"
    onTrigger={this.handleTrigger}
    closeClassName="acc-closed"
    openClassName="acc-open"
    renderExpandAllButton={true} // 🙀
    // let your imagination run wild
  />
)
```

Alternatively you'd have many components that have similar APIs and implementation but are subtlety different:

```js
<Tabs items={items} position="top" />
<Accordion items={items} position="top" />
```

Code duplication isn't inherently bad, remember too many abstract-layers are also bad.

> Optimize for deletability

But let's try to design an API for a component that would encapsulate the UI Pattern, no more, no less:

Let's do it!
Wait. remember how I said "to abstract correctly you must understand the problem well"?

Let's define the UI pattern we're creating a component for in 1 sentence:

> A `/(carousel|tabs|accordion)/` component should should toggle activity of list-items/children

See how there's no mention of display there? This UI pattern is on it's own invisible!
It also doesn't mention how items/children respond to being active/non-active.

This is how we might use such a component:

```js
<Switcher>
  {({ actives, setActives }) => (
    <Fragment>
      <div hidden={actives[0]} onClick={() => toggle(0)}>One</div>
      <div hidden={actives[1]} onClick={() => toggle(1)}>Two</div>
      <div hidden={actives[2]} onClick={() => toggle(2)}>Tree</div>
    </Fragment>
  )}
</Switcher>
```

```js
import React, { useState } from 'react';

const Switcher = ({ initial, children }) => {
  const [actives, setActives] = useState(initial);

  return children({ actives, setActives });
};
```

Another example I'd like to make is this one:

```
// mobile
╔═══╤═════════════╗
║ a │ b           ║
╟───┴─────────┬───╢
║ c           │ d ║
╟─────────────┴───╢
║ e               ║
╚═════════════════╝

// tablet
╔═════════╤═══╗
║ b       │ a ║
╟─────────┼───╢
║ c       │ d ║
╟─────────┴───╢
║ e           ║
╚═════════════╝

// desktop
╔════════╗┌───┐
║ b    <─╫┤ a │
╟────────╢└───┘
║ c      ║
╟────────╢
║ a      ║
╚════════╝
╔════════╗
║ b      ║
╟────────╢
║ a      ║
╚════════╝


There are a lot of great examples to be made here, but I only have like 15 minutes left..

key take away: Embrace using components beyond the visual

...

This leads to having a LOT of components.

Knowing which components there are availeble to you as a developer isn't as easy as looking at the visual design, mock-ups.
Even a UI decomposition and visual styleguide may not be enough for a developer to know all components.

What you need is a component library, where component are shown/demonstrated and documented.

**Enter Storybook**.

## Storybook



...

This leads to a potentially massive collection of component and their variants/usages.

That's great, now we can experiment on component, view them, read about them, detect changes to the dom.

Did we forget something?

What would be awesome: the ability to get visual changes detected too!

**Enter Chromatic**.

## Chromatic

