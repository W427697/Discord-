import React, { Component } from 'react';
import glamorous from 'glamorous';
import docsearch from 'docsearch.js';

import SearchIcon from './icons/Search';

const Form = glamorous.form({
  display: 'inline-block',
  position: 'relative',
  height: 50,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  verticalAlign: 'middle',
  '& > *': {
    display: 'block !important',
    height: '100%',
  },
});

const Submit = glamorous.button({
  position: 'absolute',
  top: 1,
  margin: 0,
  border: 0,
  backgroundColor: 'rgba(255, 255, 255, 0)',
  padding: 0,
  width: 30,
  height: '100%',
  verticalAlign: 'middle',
  textAlign: 'center',
  fontSize: 'inherit',
  userSelect: 'none',
  pointerEvents: 'none',
  right: 'inherit',
  left: 5,
  display: 'flex',
  alignContent: 'center',
  justifyContent: 'center',
  '& > *': {
    height: 16,
    width: 'auto',
  },
});

const Input = glamorous.input({
  lineHeight: 1.2,
  background: 'transparent',
  WebkitAppearance: 'none',
  boxSizing: 'border-box',
  display: 'inline-block',
  transition: 'box-shadow .4s ease, background .4s ease',
  border: 0,
  padding: 0,
  width: 40,
  height: '100%',
  verticalAlign: 'middle',
  whiteSpace: 'normal',
  fontSize: 16,
  color: 'transparent',
  fontFamily: 'inherit',
  margin: 0,
  zIndex: 1,
  [`&:focus,
    &:active
  `]: {
    paddingRight: 5,
    paddingLeft: 35,
    width: '100%',
    outline: 0,
    background: 'rgba(255,255,255,0.5)',
    color: 'inherit',
  },
  [`&::-webkit-search-decoration, 
    &::-webkit-search-cancel-button, 
    &::-webkit-search-results-button, 
    &::-webkit-search-results-decoration
  `]: {
    display: 'none',
  },
  '&::placeholder': {
    color: 'transparent',
  },
  [`&:focus::placeholder,
    &:active::placeholder
  `]: {
    color: 'rgba(0,0,0,0.2)',
  },
});

let count = 1;

const Search = class extends Component {
  constructor(props) {
    super(props);

    this.id = `docsearch-${count}`;
    count += 1;
    this.submitHandler = event => {
      event.preventDefault();
    };
  }
  componentDidMount() {
    const { id } = this;
    console.log('HERE');
    docsearch({
      apiKey: 'a4f7f972f1d8f99a66e237e7fd2e489f',
      indexName: 'storybook-js',
      inputSelector: `#${id}`,
      autocompleteOptions: {
        // debug: true,
        dropdownMenuContainer: '#suggestions',
      },
    });
  }
  render() {
    const { props, id } = this;
    const { onFocus, onBlur } = props;

    return (
      <Form novalidate="novalidate" onSubmit={this.submitHandler}>
        <Input
          ref={el => {
            this.input = el;
          }}
          autoComplete="off"
          onFocus={onFocus}
          onBlur={onBlur}
          id={id}
          name="search"
          placeholder="Search the docs"
          required="required"
          type="search"
        />
        <Submit title="Submit your search query." type="submit" tabIndex="-1">
          <SearchIcon />
        </Submit>
      </Form>
    );
  }
};

export { Search as default };
