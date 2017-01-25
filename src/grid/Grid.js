import React from 'react';
import GridTitles from './GridTitles';
import GridRows from './GridRows';
import Paginate from './paginate/Paginate';

class Grid extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data
    }
  }

  onNextPage(dataFilteredByPaginate) {
    this.setState({
      data: dataFilteredByPaginate
    });
  }

  render() {

    let {className, titles, data} = this.props;

    return (
      <div className='sv-table-responsive-vertical'>
        <table className={className}>
          <GridTitles gridTitles={titles}/>
          <GridRows gridRows={this.state.data}/>
          <Paginate gridData={this.state.data}
                    onNextPage={(dataFilteredByPaginate) => this.onNextPage(dataFilteredByPaginate)}/>
        </table>
      </div>
    );
  }
}

Grid.defaultProps = {
  className: 'sv-table with--hover with--borders'
};

Grid.propTypes = {
  className: React.PropTypes.string,
  data: React.PropTypes.array.isRequired,
  titles: React.PropTypes.array.isRequired,
};

export default Grid;