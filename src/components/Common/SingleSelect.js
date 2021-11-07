import React from 'react'
import AsyncSelect  from 'react-select/async';
import _ from 'lodash';



class SingleSelect extends React.Component {
	constructor(props) {
		super(props);
		this.getOptions = _.debounce(this.getOptions.bind(this), 500);
	  }
	
	  handleChange = selectedOption => {
		  this.props.onChange(this.props.name, selectedOption);
	  };

	  handleBlur = () => {
	    this.props.onBlur(this.props.name, true);
		};
	
	  mapOptionsToValues = options => {
		return options
	  };
	
	  getOptions = (inputValue, callback) => {
		if (!inputValue && !this.props.fullLoad) {
		  return callback([]);
		}

		var endPointQuery=`?page=0&size=50&search=${inputValue}&sort_Field=name&sort_order=asc`

		if(this.props.extraQuery){
			endPointQuery += `&filterfield[]=state&filtertype[]=eq&filtervalue[]=${this.props.extraQuery._id}`;
		}

		if(this.props.extraFilter){
			endPointQuery += this.props.extraFilter;
		}

		this.props.endPoint(endPointQuery,inputValue).then(data => {
			const results = data.totalData;
			callback(this.mapOptionsToValues(results));
		 
		});
	  };
	
	  render() {
		const { defaultOptions, placeholder,  } = this.props;
		return (
			<div >
			
			{this.props.title?<label htmlFor="color">{this.props.title}</label>:""}
		    <AsyncSelect
				isMulti={this.props.isMulti}
		    	getOptionLabel={values => values.name}
		    	getOptionValue={values => this.props.slugOptionValue ? values.slug : values._id }
		    	cacheOptions={(this.props.extraQuery)?false:true}
		    	value={this.props.value}
		    	defaultOptions={defaultOptions}
		    	loadOptions={this.getOptions}
		    	onBlur={this.handleBlur}
		    	placeholder={this.props.placeholder}
		    	onChange={this.handleChange}
		    />
			{this.props.smallMessage && (
			        <div style={{ marginTop: '.5rem' }}>{this.props.smallMessage}</div>
		        )}
		  {!!this.props.error && this.props.error.toLowerCase().includes(this.props.name.toLowerCase())  && (
			        <div style={{ color: 'red', marginTop: '.5rem' }}>{this.props.error}</div>
		        )}
		    </div>
		);
	  }
}

export { SingleSelect };