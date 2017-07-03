export default {
  name: 'default',
  palette: {
    /* Main color settings */
    background: '#f7f7f7' /* background of panels */,
    border: '#eeeeee' /* border like in the stories list */,
    canvas: 'white' /* preview area */,
    text: '#444444' /* active text in panels */,

    secondaryBorder: '#eaeaea' /* border like in the addons panel */,
    secondaryText: 'black',
    secondaryBackground: 'white' /* addons area */,

    logoText: '#828282' /* text in logo */,
    logoBorder: '#c1c1c1' /* border of logo */,

    filterBackground: 'white',

    resizerColor: 'rgba(0, 0, 0, 0.0980392)' /* grips in resizers */,
    resizerBackground: '#f7f7f7',
  },
  style: {
    /* other styling settings */
    inactiveOpacity: 0.5,
  },
  spacing: {
    /* default spacing settings */
    leftPanelSize: 100,
    downPanelSize: 100,
  },
  baseFont: {
    fontFamily: `
      -apple-system, ".SFNSText-Regular", "San Francisco", "Roboto",
      "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif
    `,
    fontSize: 15,
  },
};
