export default function (source: any) {
  return `
    ${source}
    window.STORYBOOK_ANGULAR_TYPES = "foo";
  `
}
