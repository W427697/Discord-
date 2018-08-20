import { StyleSheet } from 'react-native-compat';

export default {
  main: {
    flex: 1,
  },
  icon: {
    width: 20,
    height: 20,
  },
  headerContainer: {
    paddingVertical: 4,
    paddingLeft: 4,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 10,
    fontSize: 20,
    color: 'black',
  },
  menuContainer: {
    ...StyleSheet.absoluteFillObject,
    right: null,
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderColor: 'black',
  },
  previewWrapper: {
    flex: 1,
  },
  text: {
    fontSize: 18,
  },
  hideButtonText: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.4)',
  },
  showStoriesButton: {
    fontSize: 18,
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
    borderColor: 'rgba(0, 0, 0, 0.3)',
  },
  closeButton: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tab: {
    marginRight: 15,
  },
  addonList: {
    flexDirection: 'row',
  },
  invisible: {
    opacity: 0,
    position: 'absolute',
  },
  flex: {
    flex: 1,
  },
  addonBox: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
  },
  topBar: {
    backgroundColor: 'black',
    height: 20,
  },
  bottomBar: {
    backgroundColor: 'white',
    height: 20,
    alignItems: 'flex-end',
  },
  resizeButton: {
    backgroundColor: 'black',
    width: 20,
    height: 20,
  },
  modal: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  modalInvisible: {
    width: 0,
    height: 0,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
    marginBottom: '2%',
  },
};
