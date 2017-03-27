import React from 'react';

class ColumnActions extends React.Component {
  constructor(props){
    super(props);

    this.filterChange = this.filterChange.bind(this);
    this.addToDistinctFilter = this.addToDistinctFilter.bind(this);
    this.sort = this.sort.bind(this);


    this.styles = {
      box: {
        position: 'absolute',
        width: '250px',
        top: '34px',
        padding: '0px',
        fontFamily: 'Arial, "sans serif"',
        fontSize: '13px',
        backgroundColor: 'rgba(255, 255, 255, .99)',
        border: '1px solid rgba(0,0,0,.2)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        zIndex: '99',
        textTransform: 'none',
      },
      h6: {
        fontSize: '13px',
        padding: '5px 0 0 0',
        fontWeight: 'bold',
      },
      hr: {
        margin: '0 0 6px 0',
      },
      filterValues: {
        height: '100px',
        overflow: 'auto',
        backgroundColor: '#fff',
        border: '1px solid #c0ccda',
        borderRadius: '2px',
        color: 'inherit',
        margin: '4px 0 6px 0',
        fontSize: '13px',
        padding: '4px 8px',
        verticalAlign: 'middle',
        boxShadow: 'inset 0 0 3px #e0e6ed',
        width: '100%',
        whiteSpace: 'nowrap',
      },
      containerTop: {
        padding: '7px',
        backgroundColor: '#f9f9f9',
        textAlign: 'center',
        borderBottom: '1px solid #d7dfe8',
      },
      containerOrder: {
        padding: '4px 7px 0 7px',
        height: '40px',
      },
      container: {
        padding: '0 7px',
        marginBottom: '7px',
      },
      containerBottom: {
        borderTop: '1px solid #d7dfe8',
        backgroundColor: '#f9f9f9',
        padding: '12px 7px',
        textAlign: 'center',
      },
      sortButtons: {
        fontFamily: 'Arial, "sans serif"',
        fontSize: '13px',
        color: '#607d8b',
      }
    };

  }

  filterChange(e) {
    let queryText = e.target.value.trim();
    this.props.onSearch({dataKey: this.props.dataKey, value: queryText, dataType: this.props.dataType});
  }

  sort(direction) {
    if(this.props.dataKey) {
      this.props.onSort(direction, this.props.dataKey);
    }
  }

  filterDistinct(e) {
    let queryText = e.target.value.trim();
    this.props.onFilterDistinct({dataKey: this.props.dataKey, value: queryText, dataType: this.props.dataType});
  }

  addToDistinctFilter(e) {
    let queryText = e.target.value.trim();
    debugger;
  }

  renderFilter() {

    let uniques = this.props.uniqueValues[this.props.dataKey];
    let uniqueValues = '';

    if(uniques) {
      uniqueValues = uniques.map((uniq, i) => {
        return (
          <li key={`${uniq}__${i}`}>
            <label className='sv-no-margins'>
              <input onChange={(e) => this.addToDistinctFilter(e)} type='checkbox' value={uniq}/> {uniq}
            </label>
          </li>
        );
      });
    }

    return (
      <div style={this.styles.container}>
        <h6 style={this.styles.h6}>Filtro por valor</h6>
        <hr style={this.styles.hr} />
        <div>
          <form className='sv-form' onSubmit={(e) => e.preventDefault()}>
            <input onChange={(e) => this.filterDistinct(e)} placeholder='Filtrar por' type='text' />

            <div style={this.styles.filterValues}>
              <ul>
                {uniqueValues}
              </ul>
            </div>
          </form>
        </div>

        <h6 style={this.styles.h6}>Filtro por condição</h6>
        <hr style={this.styles.hr} />
        <form className='sv-form' onSubmit={(e) => e.preventDefault()}>
          <label>
            <span>Condição</span>
            <div className='sv-select'>
              <select>
                <option value=''>Selecione</option>
                <option value='C'>Contém</option>
                <option value='N'>Começa com</option>
                <option value='N'>Termina com</option>
              </select>
              <label>
                <i className='fa fa-angle-down fa-fw' />
              </label>
            </div>
          </label>
          <input onChange={(e) => this.filterChange(e)} placeholder='Filtrar por' type='text' />
        </form>
      </div>
    );
  }

  renderButtons() {
    return (
      <div style={this.styles.containerBottom}>
        {this.props.searchable ? (<button className='sv-button primary small sv-horizontal-marged-15'>Aplicar</button>) : null}
        <button className='sv-button default small sv-horizontal-marged-15' onClick={() => this.props.onClose(this.props.dataKey)}>Cancelar</button>
      </div>
    );
  }

  render() {



    if (this.props.isVisible) {
      this.styles.box.display = 'block';
    } else {
      this.styles.box.display = 'none';
    }

    return (
      <div className='pwt-actions' onClick={(e) => e.stopPropagation()} style={{...this.styles.box, ...this.props.style}}>

        <div style={this.styles.containerTop}>
          <h6 style={this.styles.h6}>{this.props.columnTitle}</h6>
        </div>
        <div style={this.styles.containerOrder}>
          <button className='sv-button link link-default sv-pull-left' onClick={() => this.sort('ASC')} style={this.styles.sortButtons}>
            Ordenar <i className='fa fa-sort-alpha-asc'/>
          </button>
          <button className='sv-button link link-default sv-pull-right' onClick={() => this.sort('DESC')} style={this.styles.sortButtons}>
            Ordenar <i className='fa fa-sort-alpha-desc'/>
          </button>
        </div>

        {this.props.searchable ? this.renderFilter() : null}
        {this.renderButtons()}

      </div>

    );
  }
}

ColumnActions.displayName = 'ColumnActions';

ColumnActions.defaultProps = {
  uniqueValues: {},
};

ColumnActions.propTypes = {
  columnTitle: React.PropTypes.string,
  dataKey: React.PropTypes.string,
  dataType: React.PropTypes.string,
  isVisible: React.PropTypes.bool,
  onClose: React.PropTypes.func,
  onFilterDistinct: React.PropTypes.func,
  onSearch: React.PropTypes.func,
  onSort: React.PropTypes.func,
  position: React.PropTypes.object,
  searchable: React.PropTypes.bool,
  style: React.PropTypes.object,
  uniqueValues: React.PropTypes.any,
};

export default ColumnActions;