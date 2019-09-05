import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { SectionList, Text, TextInput, TouchableOpacity, View, SafeAreaView, ScrollView } from 'react-native';
import Events from '@storybook/core-events';
import style from './style';
import StoryTreeView from '../StoryTreeView'

const SectionHeader = ({ title, selected }) => (
  <View key={title} style={style.header}>
    <Text style={[style.headerText, selected && style.headerTextSelected]}>{title}</Text>
  </View>
);

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
};

const ListItem = ({ kind, title, selected, onPress }) => (
  <TouchableOpacity
    key={title}
    style={style.item}
    onPress={onPress}
    testID={`Storybook.ListItem.${kind}.${title}`}
    accessibilityLabel={`Storybook.ListItem.${title}`}
  >
    <Text style={[style.itemText, selected && style.itemTextSelected]}>{title}</Text>
  </TouchableOpacity>
);

ListItem.propTypes = {
  title: PropTypes.string.isRequired,
  kind: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
};



export default class StoryListView extends Component {
  constructor(props, ...args) {
    super(props, ...args);

    this.state = {
      data: [],
      originalData: [],
    };

    this.storyAddedHandler = this.handleStoryAdded.bind(this);

    props.stories.on(Events.STORY_ADDED, this.storyAddedHandler);
  }

  componentDidMount() {
    this.handleStoryAdded();
  }

  componentWillUnmount() {
    const { stories } = this.props;
    stories.removeListener(Events.STORY_ADDED, this.storyAddedHandler);
  }

  buildStoriesTree=(stories)=>{
    const { selectedKind, selectedStory } = this.props;

    let hashmap={};
    let result=[];
    stories.forEach(story=>{
      let components=story.kind.split(this.props.clientApi.getSeparators().hierarchyRootSeparator);
      components = components.map(component => component.split(this.props.clientApi.getSeparators().hierarchySeparator));
      components = components.flat(1);
      components.forEach((component, i)=>{
        let parentComponentId=components.slice(0,i).join("/");
        let componentId=components.slice(0,i+1).join("/");
        if(!hashmap[componentId]){
          let newNode={
            id:componentId,
            name:component,
            collapsed:true,
            children:[]
          }
          hashmap[componentId]=newNode;

          if(parentComponentId){
            let parent=hashmap[parentComponentId]
            parent.children.push(newNode)
          }else{
            result.push(newNode)
          }
        }
      })
      hashmap[story.kind].children=story.stories.map(item=>({
        name:item,
        kind:story.kind
      }));


    })

    // if(selectedKind){
    //   let components=selectedKind.split("/");
    //   components.forEach((component, i)=>{
    //       let componentId=components.slice(0,i+1).join("/");
    //       hashmap[componentId].collapsed=false;
    //   });
    // }

    return result;
  }

  handleStoryAdded = () => {
    const { stories } = this.props;

    if (stories) {
      const data = this.buildStoriesTree(stories.dumpStoryBook())

      this.setState({ data, originalData: data });
    }
  };


  handleChangeSearchText = text => {
    const query = text.trim().toLowerCase();
    const { originalData: data } = this.state;

    const filterData=data=>{
      let result=[];

      data.forEach(item=>{
        item={...item};
        if(item.name.toLowerCase().includes(query)){
          result.push(item);
        }else if(item.children){
          item.children=filterData(item.children);
          if(item.children.length>0)result.push(item);
        }
      });

      return result;
    }


    if (!query) {
      this.setState({ data });
      return;
    }

    let filteredData=filterData(data);

    this.setState({ data: filteredData });
  };

  changeStory(kind, story) {
    const { events } = this.props;

    events.emit(Events.SET_CURRENT_STORY, { kind, story });
  }

  render() {
    const { selectedKind, selectedStory } = this.props;
    const { data } = this.state;

    return (
      <SafeAreaView style={style.flex}>
        <TextInput
          clearButtonMode="while-editing"
          disableFullscreenUI
          onChangeText={this.handleChangeSearchText}
          placeholder="Filter"
          returnKeyType="search"
          style={style.searchBar}
        />
        <ScrollView style={style.sectionList}>
          <StoryTreeView
            selectedKind={selectedKind}
            selectedStory={selectedStory}
            ref={ref => (this.treeView = ref)}
            data={this.state.data}
            onNodePress={({node, level})=>{
              if(!node.children){
                this.changeStory(node.kind, node.name)
              }
            }}
            renderNode={({node, level, isExpanded, hasChildrenNodes}) => (
              <View>
                <Text
                  style={{
                    marginLeft: 25 * level,
                    fontWeight:(node.kind === selectedKind && node.name === selectedStory)?"bold":"normal"
                  }}
                >
                  {isExpanded !== null && hasChildrenNodes ? (
                    <Text>{isExpanded ? ' ▼ ' : ' ▶ '}</Text>
                  ) : (
                    <Text> - </Text>
                  )}
                  {node.name}
                </Text>
              </View>
            )}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

StoryListView.propTypes = {
  stories: PropTypes.shape({
    dumpStoryBook: PropTypes.func.isRequired,
    on: PropTypes.func.isRequired,
    emit: PropTypes.func.isRequired,
    removeListener: PropTypes.func.isRequired,
  }).isRequired,
  events: PropTypes.shape({
    on: PropTypes.func.isRequired,
    emit: PropTypes.func.isRequired,
    removeListener: PropTypes.func.isRequired,
  }).isRequired,
  selectedKind: PropTypes.string,
  selectedStory: PropTypes.string,
};

StoryListView.defaultProps = {
  selectedKind: null,
  selectedStory: null,
};
