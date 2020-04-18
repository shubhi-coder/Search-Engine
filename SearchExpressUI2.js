import React, { Component, Fragment } from 'react'
import './SearchExpress.css'
import axios from 'axios';
import Loader from './loader.gif';
import 'bootstrap/dist/css/bootstrap.min.css';
import MappedList from './MappedList'
import {Bootstrap,Button} from 'react-bootstrap'
import BodyBackgroundColor from 'react-body-backgroundcolor';
import history from './history';



class SearchExpressUI2 extends Component {

    constructor(props)
    {
        super(props); 
            this.state=
            {
                searchquery:'',
                selected:'',
                results:[],
                loading:false,
                message:'',
                items:[],
                counter:0
            };
            this.cancel=''; 
          this.handleSubmit=this.handleSubmit.bind(this)
     };


     fetchSearchResults=()=>{
        const searchUrl='http://localhost:9000/api/home';
         if(this.cancel){  //if there is something in the current request then cancel the previous request
             this.cancel.cancel();
         }
         this.cancel=axios.CancelToken.source();//if not then we will create the token and store it

         axios.get(searchUrl,{cancelToken:this.cancel.token,})
        //  .then(res=>{
        //      console.warn(res.data)//gives us only the data saved in the database..other useless data goes away
        .then(res=>{
            const resultNotFoundMsg=!res.data?
            'There is no such search result. Please add a page':'';
               console.log(res.data)
            this.setState({
                results:res.data,
                message:resultNotFoundMsg,
                loading:false,               
            })           
        })      
         .catch(error=>{
             if(axios.isCancel(error)||error){
                    this.setState({
                        loading:false,
                        message:'Failed to fetch the data. Please check the network'
                    })
             }
            })           
     };
                    handleSubmit(event){
                        const {searchquery,results}=this.state
                         event.preventDefault();                         
                        const resp =  axios.get(`http://localhost:9000/api/home`);
                        this.setState({
                            results:resp.data
                            });
                           
                            const items = results.filter((result)=>{
                                if(!searchquery)
                                 return 'There is no such search result. Please add a page'
                                else if(result.title.toLowerCase().includes(searchquery.toLowerCase())||result.Tags.toLowerCase().includes(searchquery.toLowerCase())){
                                    return result
                                }
                            }).map(result =>{
                                       return(<a key={result.title}>
                                             <h1>Title:{result.title}</h1>
                                         <p>Description: {result.Area}</p>
                                       <p> Tags: {result.Tags}</p>
                                       <p> Likes:{result.Likes}</p>
                                       </a> )}
                                       )   
                                    this.setState({items:items}) 
                                 }                                                   
                   
                      handleOnInputChange=(event)=>{
                        const searchquery=event.target.value;
                        if(!searchquery){
                                this.setState({loading:false,searchquery,results:{},message:''});
                        }
                        else{
                        this.setState({searchquery:searchquery, loading:true,message:''},()=>{
                            this.fetchSearchResults(searchquery);//callbackfunction
                        
                        });      
                       }
                     
                    };
                    
                    
render()
{      
     const {searchquery,message,loading,items}=this.state;     //  pulling state out of constructor

    return(     
      <form>
         <div className="container">	  
		 	<h1 className="heading">SEARCH EXPRESS</h1>
               <label className="search-label" htmlFor="search-input">
                <input 
                name="searchquery"
                type="text"
                value={searchquery} 
                id="search-input"
                placeholder="Search.."
                onChange={this.handleOnInputChange}   
                >              
                </input>                            
                 </label>        
            {message && <p className="message">{message}</p>}
            
            <React.Fragment>
             {    
                  items.map(result=>(                                
                 <React.Fragment key = {result.id}>                                                                              
                 <h6>{result}</h6>                     
                 </React.Fragment>
                 ))              
            }
            </React.Fragment>
                  
           <img src={ Loader } className={`search-loading ${ loading ? 'show' : 'hide' }`} alt="loader"/>   
           <MappedList listDisplayer = {this.handleSubmit}/>
           {/* <div class="text-right mb-3"> */}
          <Button variant='light' onClick={() => history.push('/AddPageUI')}>Add</Button>   
          </div>  
      </form>   
   )
}
 }
  export default SearchExpressUI2