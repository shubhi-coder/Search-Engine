import React, { Component, Fragment } from 'react'
import './SearchExpress.css'
import axios from 'axios';
import Loader from './loader.gif';
import 'bootstrap/dist/css/bootstrap.min.css';
import MappedList from './MappedList'



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
                items:[]
            };
            this.cancel=''; 
          this.handleSubmit=this.handleSubmit.bind(this)
     };


     fetchSearchResults=(searchquery)=>{
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
   

     renderSearchList=()=>
     {
        //  event.preventDefault();
         const {results}=this.state//pulling data out of state..results is an object
          if(Object.keys(results).length && results.length){      
              if(results){  
                  this.setState({message:'data exists'})  
            return(          
                <div className="results-container"> {                         
                    results.map(result=>{  
                     return( 
                     <div>                                       
                      <a key={result.title}
                      className="result-item" >
                <h6>{results.title}</h6>         
          </a>  </div>
            ) } ) } </div>)}
                     }
                    }     

                    handleSubmit(event){
                        const {searchquery,results}=this.state
                         event.preventDefault();
                        const resp =  axios.get(`http://localhost:9000/api/home`);
                        this.setState({
                            results:resp.data
                            });
                           
                            const items = results.filter((result)=>{
                                if(!searchquery)
                                 return ""
                                else if(result.title.toLowerCase().includes(searchquery.toLowerCase())||result.Tags.toLowerCase().includes(searchquery.toLowerCase())){
                                    return result
                                }
                            }).map(result =>{
                                       return(<a key={result.title}>
                                             <h6>Title:{result.title}</h6>
                                         <li>Description: {result.Area}</li>
                                       <li> Tags: {result.Tags}</li>
                                       <li> Likes:{result.Likes}</li>
                                       </a> )}
                                       )   
                                    this.setState({items:items})                                                     
                      };

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
     const {searchquery,message,loading,items,results}=this.state;     //  pulling state out of constructor

    return(     
      <form>
         <div className="container">	 
		 	<h2 className="heading">SEARCH EXPRESS</h2>
             <i className="dropdown icon"></i>
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
                <i className="fa fa-search search-icon"/>             
                </label> 
              
            {message && <p className="message">{message}</p>}
             {                         
                    items.map(result=>{  
                     return(
                     <div>                                                            
                <h6>{result}</h6>                     
                </div>)  })
            }
          
          
           <img src={ Loader } className={`search-loading ${ loading ? 'show' : 'hide' }`} alt="loader"/>   
             {/* {this.renderSearchList()} */}
           <MappedList listDisplayer = {this.handleSubmit}/>
            
         
           {/* <ul>{items}</ul>*/}
         <button className="ui button">Add</button> 
        </div>                                                          
      </form> 
     
   )
}
 }
  export default SearchExpressUI2

