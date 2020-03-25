import React, { Component } from 'react';
import Header from './components/header';
import Navbar from './components/navbar';
import Contents from './components/contents';
import axios from 'axios'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
        dataSantri : [],
        newDataSantri : [],
        value : '',
        postDataSantri : {
          name: '',
          username : ''
        },
        isUpdate : false,

        currentPage : 1,
        dataSantriPerPage : 5,
        dataSantriWithLimit : [],
        paginationNumbers  : []
    }
  }

  componentDidMount() {
    this.getDataSantri()
  
  }
  getDataSantri = () => {
    axios.get(`http://localhost:4000/posts?_sort=id&_order=desc`)
    .then((result) => {
        this.setState({
          dataSantri : result.data,
        }, () => {
          this.setPagination()
        })
    })
  }
  postDataSantri = () => {
    axios.post(`http://localhost:4000/posts `, this.state.postDataSantri)
    .then((result) => {
      console.log(result);
      this.getDataSantri()
    })
  }
  putDataSantri = () => {
    axios.put(`http://localhost:4000/posts/${this.state.postDataSantri.id}`, this.state.postDataSantri)
    .then(res => {
      this.getDataSantri()
    })
  }
  onHandleInput = (event) => {
    let NewPostDataSantri = {...this.state.postDataSantri}
    NewPostDataSantri[event.target.name] = event.target.value
    let timeid = new Date().getTime()

    if(!this.state.isUpdate){
      NewPostDataSantri['id'] = timeid
    }
    
    this.setState({
      postDataSantri : NewPostDataSantri
    }, () => {
      console.log(this.state.postDataSantri, 'isi state.postDataSantri');
    })
  }
  simpanDataSantri = () => {
    this.postDataSantri()
    console.log('data telah tersimpan');
    this.setState({
      postDataSantri: {
        name: '',
        username: ''
      }
    })
  }
  onHandleDelete = (id) => {
    axios.delete(`http://localhost:4000/posts/${id}`)
    .then(() => {
      this.getDataSantri()
    })
  }
  dataUpdate = (e) => {
    this.setState({
      postDataSantri : e,
      isUpdate : true
    })
  }
  onHandleUpdate = () => {
    this.putDataSantri()
      this.setState({
        postDataSantri : {
          name: '',
          username: ''
        }
      })
  }
  searchedSantri = (e) => {
    console.log(e.target.value)
    this.setState ({
      value : e.target.value
    }, () => {
      if(this.state.dataSantri) {
        const searchedSantri = this.state.dataSantri.filter (
          item => item.name.toLowerCase().indexOf(this.state.value.toLowerCase()) > -1
        )
        this.setState({
          newDataSantri : searchedSantri
        }, () => this.setPagination())
      }
    })
  }

  setPagination = () => {
    const {
      dataSantri,
       currentPage,
      dataSantriPerPage,
      newDataSantri,
      value
    } = this.state
    
    const lastIndexOfSantri = currentPage * dataSantriPerPage;
    const firstIndexOfSantri = lastIndexOfSantri - dataSantriPerPage;
    const emptyDataSantri = []

    const dataSantriWithLimit = value &&  newDataSantri.length
                                ? newDataSantri.slice(firstIndexOfSantri, lastIndexOfSantri)
                                : value && !newDataSantri.length
                                ? emptyDataSantri
                                : dataSantri.slice(firstIndexOfSantri, lastIndexOfSantri)

    const paginationNumbers = [];
    const currentDataSantriLength = value && newDataSantri.length
                                    ? newDataSantri.length
                                    : value && !newDataSantri.length
                                    ? emptyDataSantri.length
                                    : dataSantri.length

    for (let i = 1; i <= Math.ceil(currentDataSantriLength / dataSantriPerPage); i++ ){
      paginationNumbers.push(i);
    }

    this.setState({
      dataSantriWithLimit,
      paginationNumbers
    },
    () => {
      console.log('dari setPagiantion')
      console.log('dataSantriLimit')
      console.log(this.state.dataSantriWithLimit)
      console.log('paginationNumbers')
      console.log(this.state.paginationNumbers)
    })
  }


  onMovePage = (event) => {
    this.setState(
      {
        currentPage: Number(event.target.id)
      },
      () => this.setPagination()
    )
  }
  onPreviousPage = () => {
    this.setState(prevState => ({
      currentPage: prevState.currentPage > 1
                    ? prevState.currentPage - 1
                    : prevState.currentPage
    }), () => this.setPagination())
  }

  onNextPage = () => {
    this.setState(prevState => ({
      currentPage: prevState.currentPage < this.state.paginationNumbers.length
                    ? prevState.currentPage + 1
                    : prevState.currentPage
    }), () => this.setPagination())
  }

  render() {
    
    const { onHandleInput, simpanDataSantri, onHandleDelete, onHandleUpdate, dataUpdate, searchedSantri, onPreviousPage } = this
    const { postDataSantri, 
            value, 
            dataSantriWithLimit, 
            paginationNumbers,
            currentPage
            
    } = this.state

    return (
      <div className="container-fluid bg-info text-light">
        <Header />
        <Navbar 
          onHandleInput       = {onHandleInput}  
          simpanDataSantri    = {simpanDataSantri}
          postDataSantri      = {postDataSantri}
          searchedSantri      = {searchedSantri}
        />
        <Contents 
          onHandleUpdate    = {onHandleUpdate}
          onHandleInput     = {onHandleInput}
          simpanDataSantri  = {simpanDataSantri}
          onHandleDelete    = {onHandleDelete}
          dataUpdate        = {dataUpdate}
          dataSantri        = {dataSantriWithLimit}
          newDataSantri     = {dataSantriWithLimit}
          postDataSantri    = {postDataSantri}
          searchedSantri    = {searchedSantri}
          value             = {this.state.value}
        />
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            <li className="page-item">
              <a className="page-link" 
              href="!#" 
              aria-label="Previous"
              onClick = {() => onPreviousPage ()}
              >
                <span aria-hidden="true">&laquo;</span>
                <span className="sr-only">Previous</span>
              </a>
            </li>

            {paginationNumbers.map((item, index) => (
                <li  key={index} className ={`page-item ${currentPage ===  item && 'active'}`}
                >
                  <a className="page-link"
                  href="!#"
                  id={item}
                  onClick={(event) => this.onMovePage(event)}
                  >
                    {item} 
                  </a>
                </li>
            ))}

            <li className="page-item">
              <a className="page-link"
              href="!#" 
              aria-label="Next"
              onClick = {() => this.onNextPage ()}
              >
                <span aria-hidden="true">&raquo;</span>
                <span className="sr-only">Next</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    )
  }
}
export default App;
