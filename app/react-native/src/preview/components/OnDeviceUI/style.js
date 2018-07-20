import { StyleSheet } from 'react-native-compat';

export default {
  main: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
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
    borderColor: 'black',
  },
  previewContainer: {
    flex: 1,
  },
  previewWrapper: {
    flex: 1,
  },
  text: {
    fontSize: 18,
  },
  showStoriesButton: {
    fontSize: 18,
  },
  hideButton: {
    backgroundColor: 'transparent',
    position: 'absolute',
    right: 5,
    top: 1,
  },
  preview: {
    ...StyleSheet.absoluteFillObject,
  },
  closeButton: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tab: {
    marginRight: 15,
  },
  addonList: {
    marginLeft: 10,
    marginRight: 40,
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
    marginBottom: '2%',
  },
};
