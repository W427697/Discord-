<template>
  <button type="button" :class="classes" @click="onClick" :style="style">{{ label }}..</button>
</template>

<script>
import './button.css';

export default {
  name: 'my-button',
  emits: ['onClick'],
  props: {
    /**
     * label description
     */
    label: {
      type: String,
      required: true,
    },
    /**
     * primary description
     */
    primary: {
      type: Boolean,
      default: false,
    },
    /**
     * size description 
     */
    size: {
      type: String,
      default: 'medium',
      validator: function (value) {
        return ['small', 'medium', 'large'].indexOf(value) !== -1;
      },
    },
    /**
     * background description
     */
    backgroundColor: {
      type: String,
    },
  },

  computed: {
    classes() {
      return {
        'storybook-button': true,
        'storybook-button--primary': this.primary,
        'storybook-button--secondary': !this.primary,
        [`storybook-button--${this.size}`]: true,
      };
    },
    style() {
      return {
        backgroundColor: this.backgroundColor,
      };
    },
  },

  methods: {
    onClick() {
      console.log(" button onClick --")
      this.$emit('onClick', 'clicked');
    },
  },
};
</script>
