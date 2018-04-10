import styled from 'styled-components';

export const Container = styled.div`
  text-align: left;
  box-sizing: border-box;
  width: 100%;
  padding: 0;
`;
export const Header = styled.div`
  padding: 8px 0;
  text-align: left;
  box-sizing: border-box;
  width: 100%;
`;

export const Item = styled.a`
  font-size: 14px;
  text-align: left;
  text-decoration: none;
  box-sizing: border-box;
  padding: 8px 12px;
  margin-bottom: 3px;
  width: 100%;
  display: block;
  border-radius: 3px;
  cursor: pointer;
  color: rgb(66, 82, 110);
  background-color: transparent;
  transition: all 0.3s;
  &:hover {
    background-color: rgba(9, 30, 66, 0.04);
  }
  ${({ active }) =>
    active &&
    `
    background-color: rgba(9, 30, 66, 0.04);
  `};
`;
