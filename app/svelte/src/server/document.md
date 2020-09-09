
# steps

yes before compile
you take Stories.svelte
you run all the preprocessors you need (or pass them to the parse, I don't remember exactly)
you still have some Svelte code
now you parse, you get AST
you remove every other story components
(like replacing everything with spaces, so source positions / maps stay the same)
that gives you a single story component
still Svelte code
now you compile that
gives you a compiled Svelte component, in the form of an ES module
you export that as export { default as my_story } from './my-virtual-story.svelte
mission complete
