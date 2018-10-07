import { StyleSheet } from 'react-native-compat';

export default {
  main: {
    flex: 1,
  },
  headerText: {
    marginLeft: 10,
    fontSize: 20,
    color: 'black',
  },
  text: {
    fontSize: 18,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  hideButtonText: {
    fontSize: 16,
    color: '#999999',
  },
  hideButton: {
    backgroundColor: 'transparent',
    position: 'absolute',
    right: 5,
    bottom: 12,
  },
  preview: StyleSheet.absoluteFillObject,
  previewMinimized: {
    borderWidth: 1,
    borderColor: '#b3b3b3',
  },
  tab: {
    marginRight: 15,
  },
  addonList: {
    flexDirection: 'row',
  },
  invisible: {
    height: 0,
    width: 0,
    opacity: 0,
    position: 'absolute',
  },
  flex: {
    flex: 1,
  },
};
