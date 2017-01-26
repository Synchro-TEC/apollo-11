import React from 'react';
import GridTitles from './GridTitles';
import GridRows from './GridRows';
import Paginate from './paginate/Paginate';

class Grid extends React.Component {

  constructor(props) {
    super(props);
    this.initialData = this.props.data;
    this.state = { data: this.initialData }
  }

  componentWillMount() {
    let oldData = this.state.data;
    let newData = oldData.slice(0, 10);
    this.setState({ data: newData });
  }

  paginateAction(paginateInformation) {
    let startOfSlice = (paginateInformation.currentPage * paginateInformation.numberOfRecordsForPage) - paginateInformation.numberOfRecordsForPage;
    let endOfSlice = startOfSlice + paginateInformation.numberOfRecordsForPage;
    let newData = this.initialData.slice(startOfSlice, endOfSlice);
    this.setState({ data: newData });
  }

  render() {

    let {className, titles} = this.props;

    return (
      <div className='sv-table-responsive-vertical'>
        <table className={className}>
          <GridTitles gridTitles={titles}/>
          <GridRows gridRows={this.state.data}/>
          <Paginate gridData={this.state.data}
            onFirstPage={(paginateInformation) => this.paginateAction(paginateInformation)}
            onLastPage={(paginateInformation) => this.paginateAction(paginateInformation)}
            onNextPage={(paginateInformation) => this.paginateAction(paginateInformation)}
            onPreviousPage={(paginateInformation) => this.paginateAction(paginateInformation)}
            totalSizeOfData={this.props.data.length}
          />
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