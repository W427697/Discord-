import styled from 'styled-components';
import SyntaxHighlighter from 'react-syntax-highlighter/prism';
import Icon from '@ied/icon';

export const Container = styled.section`
  box-sizing: border-box;
  padding: 20px 40px;
  max-width: 980px;
  width: 100%;
  margin: 0 auto;
`;
export const Content = styled.div`
  width: 100%;
  padding: 30px 20px 40px 20px;
  box-sizing: border-box;
`;
export const Title = styled.h1`
  font-size: 2em;
  color: #4b626d;
  margin: 10px 0;
  padding: 0;
`;
export const SectionTitle = styled.h3`
  font-size: 1.5em;
  color: #4b626d;
  margin: 0;
  margin-bottom: 30px;
  padding: 0;
  position: relative;
  display: flex;
  align-items: center;
  ${({ onClick }) => onClick && `cursor: pointer;`};
`;
export const SectionSubTitle = styled.h4`
  font-size: 1.3em;
  color: #4b626d;
  margin: 10px;
  position: relative;
  ${({ onClick }) => onClick && `cursor: pointer;`};
`;
export const SubTitle = styled.h2`
  font-size: 17px;
  color: #9e9e9e;
  margin: 0;
  margin-bottom: 20px;
  font-weight: normal;
`;
export const InfoContent = styled.ul`
  width: 100%;
  list-style: none;
  box-sizing: border-box;
  margin: 0;
  padding: 0;

  li {
    display: flex;
    box-sizing: border-box;
    margin: 10px 0;
    align-items: center;
    span {
      display: inline-block;
      color: #4b626d;
      &:first-child {
        min-width: 100px;
      }
      &:last-child {
        color: #313131;
        a {
          text-decoration: none;
          color: #2196f3;
        }
      }
    }
  }
`;
export const ExampleContent = styled.div`
  box-sizing: border-box;
  display: flex;
  width: calc(100% - 40px);
  margin: 0 auto;
  background-color: #f1f1f1;
  padding: 20px;
  align-items: center;
  min-width: 200px;
  justify-content: center;
  border-radius: 3px;
  position: relative;
  min-height: 120px;
`;

export const CodeContent = styled(SyntaxHighlighter)`
  overflow-y: scroll !important;
  width: ${({ material }) => (material ? 'calc(100% - 80px)' : 'calc(100% - 40px)')};
  margin: 0 auto !important;
  box-sizing: border-box;
  padding: 10px !important;
  border-radius: 3px;
  background-color: #f1f1f1 !important;
  span {
    background: transparent !important;
  }
`;

export const Code = styled.code`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: grey;
  color: white;
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 3px;
  line-height: 25px;
`;
export const Section = styled.section`
  flex: 1;
  box-sizing: border-box;
  border-bottom: 1px solid lightgrey;
  &:last-child {
    border-bottom: none;
  }
`;
export const PropsContent = styled.table`
  list-style: none;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  margin-left: 20px;
  table-layout: fixed;
  text-align: left;
  border-collapse: collapse;
  span {
    box-sizing: border-box;
    border-radius: 3px;
    padding: 3px 5px;
  }
  tr {
    td {
      box-sizing: border-box;
      padding: 10px;
      height: 45px;
      &:first-child {
        span {
          background-color: lightblue;
        }
      }
      &:nth-child(2) {
        span {
          background-color: lightgrey;
        }
      }
      &:nth-child(3) {
        span {
          background-color: #f97373;
        }
      }
    }
  }
`;

export const Expander = styled.div`
  overflow-y: hidden;
  height: ${({ active, height }) => {
    if (height === 0 || height === undefined) {
      return 'auto';
    }
    return active ? `${height}px` : '0px';
  }};
  transition: height 0.3s;
`;

export const Pills = styled(Icon)`
  display: inline-block;
  margin-right: 10px;
  vertical-align: middle;
  line-height: 26px;
  ${({ active }) =>
    !active &&
    active !== undefined &&
    `
    transform: rotate(-90deg);
  `} transition: transform .3s;
`;
