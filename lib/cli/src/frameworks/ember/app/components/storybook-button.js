import Component from '@ember/component';

export default Component.extend({
  /**
   * Is this the principal call to action on the page?
   */
  primary: false,

  /**
   * What background color to use
   */
  backgroundColor: undefined,

  /**
   * How large should the button be?
   */
  size: 'medium',

  /**
   * Button contents
   *
   * @required
   */
  label: 'Button',

  actions: {
    /**
     * Optional click handler
     */
    onClick: () => {},
  },
});
