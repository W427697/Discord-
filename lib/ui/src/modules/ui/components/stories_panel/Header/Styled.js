import styled from 'styled-components';

const hover = `
  cursor: pointer;
  background-color: transparent;
  transition: background-color 0.3s;
  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

export const Container = styled.header`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  height: 100%;
  width: 64px;
  background-color: rgb(7, 71, 166);
  z-index: 999;
  box-sizing: border-box;
  padding: 15px 0;
  padding-bottom: 55px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Open Sans', sans-serif;
`;

export const Logo = styled.a`
  display: block;
  text-decoration: none;
  height: 45px;
  width: 45px;
  border-radius: 45px;
  line-height: 45px;
  box-sizing: border-box;
  vertical-align: middle;
  text-align: center;
  margin-bottom: 10px;
  ${hover};
  h3 {
    color: white;
    margin: 0;
    padding: 0;
    font-weight: 300;
    font-size: 17px;
  }
`;

export const Shortcuts = styled.a`
  z-index: 1;
  position: absolute;
  display: block;
  bottom: 15px;
  color: white;
  height: 40px;
  width: 40px;
  border-radius: 40px;
  line-height: 40px;
  text-align: center;
  box-sizing: border-box;
  ${hover};
`;

export const SocialsNetworks = styled.a`
  text-decoration: none;
  height: 40px;
  width: 40px;
  border-radius: 40px;
  line-height: 40px;
  margin-bottom: 5px;
  text-align: center;
  ${hover};
  svg {
    display: inline-block;
    fill: white;
    height: 20px;
    width: 20px;
    vertical-align: middle;
  }
`;
