export default {
  'description': 'An input with errors and icons and stuffs',
  'displayName': 'Input',
  'props': {
    'ariaLabel': {
      'type': {
        'name': 'string'
      },
      'required': false,
      'description': "The <input> tag's aria-label"
    },
    'colorTheme': {
      'type': {
        'name': 'string'
      },
      'required': false,
      'description': 'CSS color string to use in :focus outline',
      'defaultValue': {
        'value': 'colors.gold',
        'computed': true
      }
    },
    'error': {
      'type': {
        'name': 'string'
      },
      'required': false,
      'description': 'When null or empty string, no error.\nIf a string, display input error and apply error styles'
    },
    'inputStyle': {
      'type': {
        'name': 'union',
        'value': [
          {
            'name': 'array'
          },
          {
            'name': 'object'
          }
        ]
      },
      'required': false,
      'description': 'Radium style object (or array of objects) to style <input> element with'
    },
    'isMobile': {
      'type': {
        'name': 'bool'
      },
      'required': false,
      'description': 'If true, default mobile styles will be applied to the component.\nNOTE: should be replaced with @media queries now that <StyleRoot/> is in the frontends'
    },
    'loading': {
      'type': {
        'name': 'bool'
      },
      'required': false,
      'description': 'If true, and props.showValidationIcons is true, show a loading spinner'
    },
    'name': {
      'type': {
        'name': 'string'
      },
      'required': true,
      'description': 'Name attribute of the <input> tag'
    },
    'onBlur': {
      'type': {
        'name': 'func'
      },
      'required': false,
      'description': "hook called on <input>'s blur event, is passed the event object",
      'defaultValue': {
        'value': '() => {}',
        'computed': false
      }
    },
    'onChange': {
      'type': {
        'name': 'func'
      },
      'required': false,
      'description': "hook called on <input>'s change event, is passed inputValue, input name, and the event object);",
      'defaultValue': {
        'value': '() => {}',
        'computed': false
      }
    },
    'onFocus': {
      'type': {
        'name': 'func'
      },
      'required': false,
      'description': "hook called on <input>'s focus event, is passed the event object",
      'defaultValue': {
        'value': '() => {}',
        'computed': false
      }
    },
    'placeholder': {
      'type': {
        'name': 'string'
      },
      'required': false,
      'description': 'placeholder text for the <input>'
    },
    'required': {
      'type': {
        'name': 'bool'
      },
      'required': false,
      'description': 'if the field is required or not, if true, basic error handling will happen',
      'defaultValue': {
        'value': 'false',
        'computed': false
      }
    },
    'showValidationIcons': {
      'type': {
        'name': 'bool'
      },
      'required': false,
      'description': 'if true, icons for valid, error, and loading states will be shown'
    },
    'type': {
      'type': {
        'name': 'string'
      },
      'required': false,
      'description': 'The type of the <input> element',
      'defaultValue': {
        'value': "'text'",
        'computed': false
      }
    },
    'valid': {
      'type': {
        'name': 'bool'
      },
      'required': false,
      'description': 'when true, and showValidationIcons is true, a checkmark icon will be shown'
    },
    'value': {
      'type': {
        'name': 'union',
        'value': [
          {
            'name': 'string'
          },
          {
            'name': 'number'
          }
        ]
      },
      'required': false,
      'description': 'the value of the input. can be used to set a defualt value for the field, and to update the value of the field.'
    },
    'width': {
      'type': {
        'name': 'string'
      },
      'required': false,
      'description': 'CSS width value for the input wrapper'
    },
    'wrapperStyle': {
      'type': {
        'name': 'union',
        'value': [
          {
            'name': 'array'
          },
          {
            'name': 'object'
          }
        ]
      },
      'required': false,
      'description': 'Radium style object (or array of objects) to style input wrapper with'
    }
  }
};
