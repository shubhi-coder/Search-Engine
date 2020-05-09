import React, { Component } from 'react'
import axios from 'axios';
import searchlogo from './searchlogo.png';
import MappedList from './MappedList'
import Loader from './loader.gif';
import './LinkPage.css'
import SearchExpressUI3 from './SearchExpressUI3'
import {
    Button,
    Container,
    Divider,
    Grid,
    Header,
    Icon,
    Image,
    List,
    Menu,
    Responsive,
    Segment,
    Sidebar,
    Visibility,
    GridColumn,
    Label,
    GridRow,
    Link,
    Accordion,
    Search,
    Table
  } from 'semantic-ui-react'
  import invest from './invest.png';

class LinkPage extends Component {

    constructor(props){
        super(props);

        this.state={
            items:[],
            linkresult:this.props.linkresult,
            searchquery:'',
            results:[],
            loading:false,
            message:'',
            items:[],
            counter:0,
            AddPageModelstate:false,
            Likes:0,
            itemstitle:[],
            HomePageRefresh:false,
            goToLinkPage:false,
            resulttitles:[],
            resultObtained:false,
            showAccordion:false
        };
        this.cancel=''; 
      
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

    
              fetchSearchResults=()=>{
                const searchUrl='https://localhost:44379/api/SearchExpress';
                 if(this.cancel){  //if there is something in the current request then cancel the previous request
                     this.cancel.cancel();
                 }
                 this.cancel=axios.CancelToken.source();//if not then we will create the token and store it
        
                 axios.get(searchUrl,{cancelToken:this.cancel.token,})
                //  .then(res=>{
                //      console.warn(res.data)//gives us only the data saved in the database..other useless data goes away
                .then(res=>{
                    const resultNotFoundMsg=!res.data?
                    'There is no data. Please add a page':'';
                       console.log(res.data); 
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
               

             clickLike=(event)=>{
              let newCount = this.state.Likes+1;
              this.setState({Likes:newCount});
             fetch('https://localhost:44379/api/SearchExpress/AddLikes',{
method:'PUT',
headers:{
'Accept':'application/json',
'Content-Type':'application/json'
},
body:JSON.stringify({      
Likes:parseFloat(this.state.Likes.value)  
})
})
.then(res=> res.json())       
//  fetch('https://localhost:44379/api/SearchExpress/AddLikes',   
//  .then(res=> res.json())   
//  .then(data=>{
//    this.setState({Likes:this.state.Likes})
//  })        
};
//   accordionResult=()=>{ 
//   <div className="accordion">
//   {this.state.linkresult.map(result=>{
//     return (<Accordion key={result.Title}
//       title={result.Title}
//       texts={result.Description}
//       />)})} 
//       </div>
// }

refresh=()=>{
  this.setState({
    HomePageRefresh:true
}); 
  }

    render() {
      const {searchquery,message,loading,items,linkresult}=this.state;
      if(this.state.HomePageRefresh){
        return(
          <SearchExpressUI3/>
        )
      }

     
        return (         
        <div> 
          <Menu  color={'blue'}>           
       <Menu.Item position='left'>
     <Button primary onClick={this.refresh}>Home</Button>
     </Menu.Item>  
   </Menu>    
    
           <Grid>
        <Grid.Column width={20}>
          <div className="searchbartop">
            <Menu>
              <Menu.Item position='left'>
              <Header       
            as='h1'
            content='SEARCH EXPRESS' 
            style={{
              fontSize: '1em',
              fontWeight: 'normal',
              marginBottom: 0,
              marginTop:'0.5em',
            }}
          />
          
            <div className="ui action input">
               <input
                type="text" 
                placeholder="Search..."
                name="searchquery"
                value={searchquery}
                id="search-input"
                onChange={this.handleOnInputChange}
                />
                
               <Button primary size='small' onClick={this.handleSubmit}>Search <Icon name='right arrow'/></Button>
                
                 {/* <MappedList listDisplayer = {this.handleLink}/> */}
                
                 </div>       
              <img src = {searchlogo} align = 'right' width={20} height={20} alt="SearchLogo" mode='fit' className="rounded float-right"/>
              </Menu.Item>
          
            </Menu>
          {/* <Table className="table">      
                  <tbody>
                  {                                
                    linkresult.map(result=>                  
                        <tr key={result.Title}> 
                         
                      <div className = "row"><td className = "result">
                          {result}</td>
                          
                      <Button primary onClick={this.clickLike}>Likes:{this.state.Likes}</Button>
                      </div>                                    
                        </tr>                        
                      )                   
                 }                    
                  </tbody>
                
                </Table>  */}
               
                {
                   <div className="accordion">
                  {this.state.linkresult.map(result=>{
                  return <Accordion key={result.Title}
                  title={result.Title}
                   texts={result.Description}
              />})} 
              </div>
            }
          </div>
          </Grid.Column>
            </Grid>
          
             <Segment inverted color='blue' style={{ padding: '0em 3em' }}>
             <Grid divided inverted stackable>
                     <Grid.Row>
                       <Grid.Column width={3} >
                       <Header inverted as='h4' content='About' />
           <List link inverted>
               <List.Item icon='users' content='NAV Backoffice'  />
               <List.Item icon='marker' content='Sitapura,Jaipur' />
               <List.Item
                 icon='mail'
                 content={<a href='mailto:hr@navbackoffice.com'>hr@navbackoffice.com</a>}
               />
               <List.Item
                 icon='linkify'
                 content={<a href='www.navbackoffice.com'>www.navbackoffice.com</a>}
               />
             </List>
             </Grid.Column>
           
             <Grid.Column width={3}>
             <Header inverted as='h4' content='Services' />
             <List link inverted>
             <List.Item as='a'>Hedge Funds </List.Item>
             <List.Item as='a'>Private Equity</List.Item>
             <List.Item as='a'>Commodity Pools</List.Item>
             <List.Item as='a'>Multi Advisor Platforms</List.Item>
             </List>
             </Grid.Column>
             <Grid.Column width={7}>
             <Header inverted as='h4' content='NAV Search Engine'/> 
             <p>Search Information related to NAV IT Documents ,Links,
             Functionalities etc.
             </p>
             </Grid.Column>
             <GridColumn width={3} > <img src = {invest} align = 'right' width={100} height={100} alt="Globe" mode='fit' style={{right:0}} float="right"/>
                        </GridColumn>
                       </Grid.Row>
                       </Grid>
                     
                       </Segment>       
                        </div>      
                
                     
               )
               
           }
      }
    


export default LinkPage
