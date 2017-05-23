import React from 'react';
import ReactDOM from 'react-dom';
import Proptypes from 'prop-types';
import update from 'immutability-helper';
import { bytesToSize } from './utils.js';
import WindowedList from 'react-windowed-list';
import axios from 'axios';
import style from './styles.css';


class PowerSheet extends React.Component {
  constructor(props){
    super(props);

    this.originalData = [];
    this.columns = this._extractColumns(props);
    this.renderItem = this.renderItem.bind(this);
    this.fixScrollBarDiff = this.fixScrollBarDiff.bind(this);

    this.state = {
      message: 'Iniciando o carregamento dos dados',
      currentData: [],
    };

  }

  componentDidMount() {
    let requestConfig = {
      method: this.props.fetch.method,
      onDownloadProgress: (e) => {
        const newState = update(this.state, {message: {$set: `${bytesToSize(e.loaded)} carregados...`}});
        this.setState(newState);
      }
    };

    if(this.props.fetch.params) {
      this.props.fetch.method === 'get' ? requestConfig.params = this.props.fetch.params : requestConfig.data = this.props.fetch.params;
    }

    axios
      .get(this.props.fetch.url, requestConfig)
      .then((response) => {
        this.originalData = response.data;
        this.setState({message: '', currentData: response.data}, () => this.fixScrollBarDiff());
      })
      .catch((error) => {
        console.error(error);
        const newState = update(this.state, {message: {$set: error}});
        this.setState(newState);
      });
  }

  componentWillUnmount() {
  }

  fixScrollBarDiff() {
    const container = ReactDOM.findDOMNode(this);
    let scrollAreaWidth = container.offsetWidth;
    let tableWidth = container.querySelector('.pw-table-tbody .pw-table-tbody-row').offsetWidth;

    if(scrollAreaWidth !== tableWidth) {
      let actionContainer = container.querySelector('.pw-table-action');
      let headerContainer = container.querySelector('.pw-table-header');
      const bordersSize = 5;
      const scrollDiffInPixels = `${scrollAreaWidth + bordersSize - tableWidth}px`;

      const actions = actionContainer.querySelectorAll('.pw-table-action-cell');
      const headers = headerContainer.querySelectorAll('.pw-table-header-cell');

      const lastActionCell = actions[actions.length - 1];
      const lastHeaderCell = headers[headers.length - 1];

      lastActionCell.style.paddingRight = scrollDiffInPixels;
      lastHeaderCell.style.paddingRight = scrollDiffInPixels;
    }
  }


  /**
   * Extrai as informações das colunas.
   *
   * @param props
   * @return {*}
   * @private
   */
  _extractColumns(props) {
    return React.Children.map(props.children, (child) => {
      return {
        title: child.props.columnTitle,
        key: child.props.dataKey,
        formatter: child.props.formatter,
        searchable: child.props.searchable,
        groupBy: child.props.groupBy
      };
    });
  }

  /**
   * Extrai a prop widh das colunas.
   *
   * @param props
   * @return {*}
   * @private
   */
  _extractColumnsWidth(props) {
    let widths = [];
    React.Children.forEach(props.children, (child) => widths.push(child.props.width));
    return widths;
  }

  renderItem(index, key) {
    let row = this.state.currentData[index];
    return (
      <div className='pw-table-tbody-row' key={key}>
        <div className='pw-table-tbody-cell' style={{flex: `0 0 ${80}px`}}>{row.id}</div>
        <div className='pw-table-tbody-cell'>{row.name.first}</div>
        <div className='pw-table-tbody-cell'>{row.name.last}</div>
        <div className='pw-table-tbody-cell'>{row.papel}</div>
        <div className='pw-table-tbody-cell'>{row.time}</div>
        <div className='pw-table-tbody-cell'>{row.email}</div>
        <div className='pw-table-tbody-cell'>{row.text}</div>
      </div>
    );
  }


  render() {
    let infoClasses = 'pw-table-info';
    if(this.originalData.length === 0) {
      infoClasses += ' active';
    }
    return (
      <div className='pw-table'>
        <div className={infoClasses}>
          {this.originalData.length ?
            ` ${this.originalData.length.toLocaleString()} registros` :
            <i className='fa fa-circle-o-notch fa-spin fa-lg fa-fw' style={{marginRight: '10px'}} />
          }
          { this.state.message }
        </div>
        {this.originalData.length > 0 &&
          <div className='pw-table-action'>
            <div className='pw-table-action-row'>
              <div className='pw-table-action-cell' style={{flex: `0 0 ${80}px`}}><i className='fa fa-fw fa-caret-square-o-down'/></div>
              <div className='pw-table-action-cell'><i className='fa fa-fw fa-caret-square-o-down'/></div>
              <div className='pw-table-action-cell'><i className='fa fa-fw fa-caret-square-o-down'/></div>
              <div className='pw-table-action-cell'><i className='fa fa-fw fa-caret-square-o-down'/></div>
              <div className='pw-table-action-cell'><i className='fa fa-fw fa-caret-square-o-down'/></div>
              <div className='pw-table-action-cell'><i className='fa fa-fw fa-caret-square-o-down'/></div>
              <div className='pw-table-action-cell'><i className='fa fa-fw fa-caret-square-o-down'/></div>
            </div>
          </div>
        }
        {this.originalData.length > 0 &&
          <div className='pw-table-header'>
            <div className='pw-table-header-row'>
              <div className='pw-table-header-cell' style={{flex: `0 0 ${80}px`}}>ID</div>
              <div className='pw-table-header-cell'>Nome</div>
              <div className='pw-table-header-cell'>Sobrenome</div>
              <div className='pw-table-header-cell'>Papel</div>
              <div className='pw-table-header-cell'>Time</div>
              <div className='pw-table-header-cell'>E-mail</div>
              <div className='pw-table-header-cell'>Texto</div>
            </div>
          </div>
        }
        {this.originalData.length > 0 &&
          <div className='pw-table-tbody' style={{maxHeight: `${this.props.containerHeight}px`}}>
            <WindowedList
            itemRenderer={this.renderItem}
            length={this.originalData.length}
            pageSize={this.props.pageSize}
            threshold={this.props.rowHeight}
            type='uniform'
            />
          </div>
        }
      </div>
    );
  }

}

PowerSheet.displayName = 'PowerSheet';

PowerSheet.propTypes = {
  containerHeight: Proptypes.number.isRequired,
  fetch: Proptypes.shape({
    url: Proptypes.string.isRequired,
    method: Proptypes.oneOf(['get', 'post']).isRequired,
    params: Proptypes.object,
  }).isRequired,
  pageSize: Proptypes.number.isRequired,
};

export default PowerSheet;