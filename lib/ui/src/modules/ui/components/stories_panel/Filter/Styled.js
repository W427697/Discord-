import styled from 'styled-components';

const focus = `
  left: 20px;
  font-size: 12px;
  top: -20px;
  opacity: 0.8;
`;

export const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
  position: relative;
  margin-top: 7px;
  margin-bottom: 10px;
  input {
    width: 100%;
    max-width: 100%;
    background-color: transparent;
    border: 0;
    border-bottom: 1px solid lightgrey;
    outline: none;
    height: 30px;
    box-shadow: none;
    box-sizing: border-box;
    padding: 0 35px 0 0;
    transition: border 0.3s;
    font-size: 14px;
    ${({ value }) =>
      value.length > 0 &&
      `
      border-bottom: 1px solid grey;
    `};
  }
  label {
    position: absolute;
    display: inline-block;
    left: 20px;
    top: 0;
    bottom: 0;
    height: 30px;
    line-height: 30px;
    vertical-align: middle;
    font-size: 14px;
    transition: all 0.3s;
    z-index: -1;
    ${({ value }) => value.length > 0 && focus};
  }
  input:focus + label {
    ${focus};
  }
  input:focus {
    border-bottom: 1px solid grey;
  }

  button {
    position: absolute;
    background-color: transparent;
    color: #868686;
    border: none;
    width: 25px;
    height: 26px;
    right: 21px;
    top: 0;
    text-align: center;
    cursor: pointer;
    line-height: 23px;
    font-size: 20px
    user-select: none;
    outline: none;
  }
`;
