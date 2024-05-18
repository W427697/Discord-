import { Component } from '@angular/core';
import { ArgTypes } from '@storybook/core/dist/types';
import { describe, it, expect } from 'vitest';
import { computesTemplateSourceFromComponent } from './ComputesTemplateFromComponent';
import { ISomeInterface, ButtonAccent, InputComponent } from './__testfixtures__/input.component';

describe('angular source decorator', () => {
  it('With no props should generate simple tag', () => {
    const component = InputComponent;
    const props = {};
    const argTypes: ArgTypes = {};
    const source = computesTemplateSourceFromComponent(component, props, argTypes);
    expect(source).toEqual('<doc-button></doc-button>');
  });

  describe('with component without selector', () => {
    @Component({
      template: `The content`,
    })
    class WithoutSelectorComponent {}

    it('should add component ng-container', async () => {
      const component = WithoutSelectorComponent;
      const props = {};
      const argTypes: ArgTypes = {};
      const source = computesTemplateSourceFromComponent(component, props, argTypes);
      expect(source).toEqual(
        `<ng-container *ngComponentOutlet="WithoutSelectorComponent"></ng-container>`
      );
    });
  });

  describe('with component with attribute selector', () => {
    @Component({
      selector: 'doc-button[foo]',
      template: '<button></button>',
    })
    class WithAttributeComponent {}

    it('should add attribute to template', async () => {
      const component = WithAttributeComponent;
      const props = {};
      const argTypes: ArgTypes = {};
      const source = computesTemplateSourceFromComponent(component, props, argTypes);
      expect(source).toEqual(`<doc-button foo></doc-button>`);
    });
  });

  describe('with component with attribute and value selector', () => {
    @Component({
      selector: 'doc-button[foo="bar"]',
      template: '<button></button>',
    })
    class WithAttributeValueComponent {}

    it('should add attribute to template', async () => {
      const component = WithAttributeValueComponent;
      const props = {};
      const argTypes: ArgTypes = {};
      const source = computesTemplateSourceFromComponent(component, props, argTypes);
      expect(source).toEqual(`<doc-button foo="bar"></doc-button>`);
    });
  });

  describe('with component with attribute only selector', () => {
    @Component({
      selector: '[foo]',
      template: '<button></button>',
    })
    class WithAttributeOnlyComponent {}

    it('should create a div and add attribute to template', async () => {
      const component = WithAttributeOnlyComponent;
      const props = {};
      const argTypes: ArgTypes = {};
      const source = computesTemplateSourceFromComponent(component, props, argTypes);
      expect(source).toEqual(`<div foo></div>`);
    });
  });

  describe('with component with void element and attribute selector', () => {
    @Component({
      selector: 'input[foo]',
      template: '<button></button>',
    })
    class VoidElementWithAttributeComponent {}

    it('should create without separate closing tag', async () => {
      const component = VoidElementWithAttributeComponent;
      const props = {};
      const argTypes: ArgTypes = {};
      const source = computesTemplateSourceFromComponent(component, props, argTypes);
      expect(source).toEqual(`<input foo />`);
    });
  });

  describe('with component with attribute and value only selector', () => {
    @Component({
      selector: '[foo="bar"]',
      template: '<button></button>',
    })
    class WithAttributeOnlyComponent {}

    it('should create a div and add attribute to template', async () => {
      const component = WithAttributeOnlyComponent;
      const props = {};
      const argTypes: ArgTypes = {};
      const source = computesTemplateSourceFromComponent(component, props, argTypes);
      expect(source).toEqual(`<div foo="bar"></div>`);
    });
  });

  describe('with component with void element, attribute and value only selector', () => {
    @Component({
      selector: 'input[foo="bar"]',
      template: '<button></button>',
    })
    class VoidElementWithAttributeComponent {}

    it('should create and add attribute to template without separate closing tag', async () => {
      const component = VoidElementWithAttributeComponent;
      const props = {};
      const argTypes: ArgTypes = {};
      const source = computesTemplateSourceFromComponent(component, props, argTypes);
      expect(source).toEqual(`<input foo="bar" />`);
    });
  });

  describe('with component with class selector', () => {
    @Component({
      selector: 'doc-button.foo',
      template: '<button></button>',
    })
    class WithClassComponent {}

    it('should add class to template', async () => {
      const component = WithClassComponent;
      const props = {};
      const argTypes: ArgTypes = {};
      const source = computesTemplateSourceFromComponent(component, props, argTypes);
      expect(source).toEqual(`<doc-button class="foo"></doc-button>`);
    });
  });

  describe('with component with class only selector', () => {
    @Component({
      selector: '.foo',
      template: '<button></button>',
    })
    class WithClassComponent {}

    it('should create a div and add attribute to template', async () => {
      const component = WithClassComponent;
      const props = {};
      const argTypes: ArgTypes = {};
      const source = computesTemplateSourceFromComponent(component, props, argTypes);
      expect(source).toEqual(`<div class="foo"></div>`);
    });
  });

  describe('with component with multiple selectors', () => {
    @Component({
      selector: 'doc-button, doc-button2',
      template: '<button></button>',
    })
    class WithMultipleSelectorsComponent {}

    it('should use the first selector', async () => {
      const component = WithMultipleSelectorsComponent;
      const props = {};
      const argTypes: ArgTypes = {};
      const source = computesTemplateSourceFromComponent(component, props, argTypes);
      expect(source).toEqual(`<doc-button></doc-button>`);
    });
  });

  describe('with component with multiple selectors starting with attribute', () => {
    @Component({
      selector: 'doc-button[foo], doc-button2',
      template: '<button></button>',
    })
    class WithMultipleSelectorsComponent {}

    it('should use the first selector', async () => {
      const component = WithMultipleSelectorsComponent;
      const props = {};
      const argTypes: ArgTypes = {};
      const source = computesTemplateSourceFromComponent(component, props, argTypes);
      expect(source).toEqual(`<doc-button foo></doc-button>`);
    });
  });

  describe('with component with multiple selectors starting with attribute and value', () => {
    @Component({
      selector: 'doc-button[foo="bar"], doc-button2',
      template: '<button></button>',
    })
    class WithMultipleSelectorsComponent {}

    it('should use the first selector', async () => {
      const component = WithMultipleSelectorsComponent;
      const props = {};
      const argTypes: ArgTypes = {};
      const source = computesTemplateSourceFromComponent(component, props, argTypes);
      expect(source).toEqual(`<doc-button foo="bar"></doc-button>`);
    });
  });

  describe('with component with multiple selectors including 2 attributes and a class', () => {
    @Component({
      selector: 'doc-button, button[foo], .button[foo], button[baz]',
      template: '<button></button>',
    })
    class WithMultipleSelectorsComponent {}

    it('should use the first selector', async () => {
      const component = WithMultipleSelectorsComponent;
      const props = {};
      const argTypes: ArgTypes = {};
      const source = computesTemplateSourceFromComponent(component, props, argTypes);
      expect(source).toEqual(`<doc-button></doc-button>`);
    });
  });

  describe('with component with multiple selectors with line breaks', () => {
    @Component({
      selector: `doc-button, 
      doc-button2`,
      template: '<button></button>',
    })
    class WithMultipleSelectorsComponent {}

    it('should use the first selector', async () => {
      const component = WithMultipleSelectorsComponent;
      const props = {};
      const argTypes: ArgTypes = {};
      const source = computesTemplateSourceFromComponent(component, props, argTypes);
      expect(source).toEqual(`<doc-button></doc-button>`);
    });
  });

  describe('with component with multiple selectors starting with attribute only with line breaks', () => {
    @Component({
      selector: `[foo], 
      doc-button2`,
      template: '<button></button>',
    })
    class WithMultipleSelectorsComponent {}

    it('should use the first selector', async () => {
      const component = WithMultipleSelectorsComponent;
      const props = {};
      const argTypes: ArgTypes = {};
      const source = computesTemplateSourceFromComponent(component, props, argTypes);
      expect(source).toEqual(`<div foo></div>`);
    });
  });

  describe('no argTypes', () => {
    it('should generate tag-only template with no props', () => {
      const component = InputComponent;
      const props = {};
      const argTypes: ArgTypes = {};
      const source = computesTemplateSourceFromComponent(component, props, argTypes);
      expect(source).toEqual(`<doc-button></doc-button>`);
    });
    it('With props should generate tag with properties', () => {
      const component = InputComponent;
      const props = {
        isDisabled: true,
        label: 'Hello world',
        accent: ButtonAccent.High,
        counter: 4,
      };
      const argTypes: ArgTypes = {};
      const source = computesTemplateSourceFromComponent(component, props, argTypes);
      expect(source).toEqual(
        `<doc-button [counter]="4" [accent]="'High'" [isDisabled]="true" [label]="'Hello world'"></doc-button>`
      );
    });

    it('With props should generate tag with outputs', () => {
      const component = InputComponent;
      const props = {
        isDisabled: true,
        label: 'Hello world',
        onClick: ($event: any) => {},
      };
      const argTypes: ArgTypes = {};
      const source = computesTemplateSourceFromComponent(component, props, argTypes);
      expect(source).toEqual(
        `<doc-button [isDisabled]="true" [label]="'Hello world'" (onClick)="onClick($event)"></doc-button>`
      );
    });

    it('should generate correct property for overridden name for Input', () => {
      const component = InputComponent;
      const props = {
        color: '#ffffff',
      };
      const argTypes: ArgTypes = {};
      const source = computesTemplateSourceFromComponent(component, props, argTypes);
      expect(source).toEqual(`<doc-button [color]="'#ffffff'"></doc-button>`);
    });
  });

  describe('with argTypes (from compodoc)', () => {
    it('Should handle enum as strongly typed enum', () => {
      const component = InputComponent;
      const props = {
        isDisabled: false,
        label: 'Hello world',
        accent: ButtonAccent.High,
      };
      const argTypes: ArgTypes = {
        accent: {
          control: {
            options: ['Normal', 'High'],
            type: 'radio',
          },
          defaultValue: undefined,
          table: {
            category: 'inputs',
          },
          type: {
            name: 'enum',
            required: true,
            value: [],
          },
        },
      };
      const source = computesTemplateSourceFromComponent(component, props, argTypes);
      expect(source).toEqual(
        `<doc-button [accent]="'High'" [isDisabled]="false" [label]="'Hello world'"></doc-button>`
      );
    });

    it('Should handle enum without values as string', () => {
      const component = InputComponent;
      const props = {
        isDisabled: false,
        label: 'Hello world',
        accent: ButtonAccent.High,
      };
      const argTypes: ArgTypes = {
        accent: {
          control: {
            options: ['Normal', 'High'],
            type: 'radio',
          },
          defaultValue: undefined,
          table: {
            category: 'inputs',
          },
          type: {
            name: 'object',
            required: true,
            value: {},
          },
        },
      };
      const source = computesTemplateSourceFromComponent(component, props, argTypes);
      expect(source).toEqual(
        `<doc-button [accent]="'High'" [isDisabled]="false" [label]="'Hello world'"></doc-button>`
      );
    });

    it('Should handle objects correctly', () => {
      const component = InputComponent;

      const someDataObject: ISomeInterface = {
        one: 'Hello world',
        two: true,
        three: [
          `a string literal with "double quotes"`,
          `a string literal with 'single quotes'`,
          'a single quoted string with "double quotes"',
          "a double quoted string with 'single quotes'",
          // eslint-disable-next-line prettier/prettier
          'a single quoted string with escaped \'single quotes\'',
          // eslint-disable-next-line prettier/prettier
          "a double quoted string with escaped \"double quotes\"",

          `a string literal with \'escaped single quotes\'`,

          `a string literal with \"escaped double quotes\"`,
        ],
      };

      const props = {
        isDisabled: false,
        label: 'Hello world',
        someDataObject,
      };

      const source = computesTemplateSourceFromComponent(component, props, null);
      // Ideally we should stringify the object, but that could cause the story to break because of unescaped values in the JSON object.
      // This will have to do for now
      expect(source).toEqual(
        `<doc-button [isDisabled]="false" [label]="'Hello world'" [someDataObject]="{one: 'Hello world', two: true, three: ['a string literal with \\'double quotes\\'', 'a string literal with \\'single quotes\\'', 'a single quoted string with \\'double quotes\\'', 'a double quoted string with \\'single quotes\\'', 'a single quoted string with escaped \\'single quotes\\'', 'a double quoted string with escaped \\'double quotes\\'', 'a string literal with \\'escaped single quotes\\'', 'a string literal with \\'escaped double quotes\\'']}"></doc-button>`
      );
    });
  });
});
