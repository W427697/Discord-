import React, {Component, PropTypes} from 'react';

export default class DocgenReader extends Component {


    render() {

        return (
            <div>
                DocgenReader

                <div style={{backgroundColor: 'white', padding: '20px 10px'}}>

                    <h2>{this.props.docgenData.displayName}</h2>
                    <p>{this.props.docgenData.description}</p>
                    <h3>Props:</h3>
                    <hr/>
                    {
                        Object.keys(this.props.docgenData.props).map((key) => {
                            let prop = this.props.docgenData.props[key];

                            return (
                                <div key={key} style={{padding: '5px'}}>

                                    {this.renderPropTitle(key, prop)}

                                    <h5>Type: {prop.type.name}</h5>

                                    {this.renderPropDefaulValue(prop)}

                                    <p>{prop.description}</p>

                                    <hr/>

                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }

    renderPropTitle(propName, propObj) {
        return <h4>{propName}{propObj.required ? <span style={{color: 'red'}}> - REQUIRED</span> : null}</h4>
    }

    renderPropDefaulValue(propObj) {

        return (propObj.defaultValue ? <h5>Default Value: {propObj.defaultValue.value}</h5> : null);
    }
}

DocgenReader.propTypes = {
  docgenData: PropTypes.object.isRequired,
};
