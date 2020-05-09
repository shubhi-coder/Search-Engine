import React, { Component, Fragment } from 'react'
import './SearchExpress.css'
import axios from 'axios';
import Loader from './loader.gif';
import 'bootstrap/dist/css/bootstrap.min.css';
import MappedList from './MappedList'
import {Bootstrap, Table,ButtonToolbar} from 'react-bootstrap'
import history from './history';
import searchlogo from './searchlogo.png';
import invest from './invest.png';
import './Components/SearchExpressUI3.css';
import AddPageModel from './AddPageModel';

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
    Link
  } from 'semantic-ui-react'
import LinkPage from './LinkPage';
import AddPageUI from './AddPageUI';

class SearchExpressUI3 extends Component {

    constructor(props)
    {
        super(props); 
            this.state=
            {
                AddPage:false,
                searchquery:'',
                selected:'',
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
                resulttitles:[]
            };
            this.cancel=''; 
          this.handleSubmit=this.handleSubmit.bind(this)
          
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
                    
                      handleSubmit(event){
                        const {searchquery,results}=this.state;
                         event.preventDefault();                         
                        const resp = axios.get(`https://localhost:44379/api/SearchExpress`)
                        .then(response=>{
                          if(response.status===200)
                          {
                            this.setState({goToLinkPage:true,results:resp.data})
                          }
                        });
                      
                          
                            const items = results.filter((result)=>{
                         if(result.Title.toLowerCase().includes(searchquery.toLowerCase())||result.Tags.toLowerCase().includes(searchquery.toLowerCase())){
                                     return result       
                          }          
                            }).map(result =>{
                                       return(<a key={result.Title}>
                                             <h1><u>{result.Title}</u></h1>
                                         <p> {result.Description}</p>
                                       <p>  Tags:{result.Tags}</p>
                                       {/* <p> Likes:{result.Likes}</p> */}
                                       </a> )}
                                       );                          
                                   this.setState({items:items});
                                }


                              //   handleLink=(event)=>{
                              //     const {searchquery,resulttitles}=this.state;
                              //      event.preventDefault();                         
                              //     const resp = axios.get(`https://localhost:44379/api/SearchExpress/GetTitleLinks`,{
                                    
                              //         params: {
                              //           searchquery: searchquery
                              //         }
                              //     })
                              //     .then(response=>{
                              //       if(response.status===200){
                              //         this.setState({goToLinkPage:true, resulttitles:resp.data})
                              //       }
                              //     });
                                
                                                                      
                              //  }

                            
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
  //  fetch('https://localhost:44379/api/SearchExpress/AddLikes',   
  //  .then(res=> res.json())   
  //  .then(data=>{
  //    this.setState({Likes:this.state.Likes})
  //  })
  hideFixedMenu = () => this.setState({ fixed: false })
  showFixedMenu = () => this.setState({ fixed: true })  

  refresh=()=>{
    this.setState({
      HomePageRefresh:true
  });}
     
  goToAddPage=()=>{
    this.setState({
      AddPage:true
  });
}
  
render()
{      
  const { children } = this.props
  const {searchquery,message,loading,items,fixed}=this.state;     //  pulling state out of constructor
  let addModelClose=()=>this.setState({AddPageModelstate:false});
  

  if(this.state.goToLinkPage==true){
    return(
      <LinkPage linkresult={items}/>
    )
  }
  if(this.state.HomePageRefresh){
    return(
      <SearchExpressUI3/>
    )
  }

  if(this.state.AddPage){
    return(
      <AddPageUI/>
    )
  }
  
   
    const getWidth = () => {
        const isSSR = typeof window === 'undefined'
      
        return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
      }
      const HomepageHeading = () => (
        <Container text>
         <img src = {searchlogo} align = 'right' width={50} height={50} alt="SearchLogo" mode='fit' className="rounded float-right"/>
          <Header       
            as='h1'
            content='SEARCH EXPRESS' 
            style={{
              fontSize: '4em',
              fontWeight: 'normal',
              marginBottom: 0,
              marginTop:'1em',
            }}
          />
         <Header
      as='h2'
      content='Search your key investments here'   
      style={{
        fontSize:'1.7em',
        fontWeight: 'normal',
        marginTop: '1.5em',
      }}
    />
          </Container>
      )          
    return(      
    
            <div>            
           <Menu>           
       <Menu.Item position='left'>
     <Button primary onClick={this.refresh}>Home</Button>
     <Button primary onClick={this.goToAddPage} style={{ marginLeft: '3em' }}>Add Page</Button>
     </Menu.Item>  
   </Menu>    
             
          <Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
        <Visibility
          once={false}
          onBottomPassed={this.showFixedMenu}
          onBottomPassedReverse={this.hideFixedMenu}
        >
          <Segment     
            textAlign='center'
            style={{ minHeight: 500, padding: '0.4em 0em' }}
            vertical
          > 
        <Segment vertical>
          <Grid>
            <Grid.Column width={15}>
            <HomepageHeading />
                <div class="ui action input">
             <input 
             style={{width: "350px", height: "50px"}}
             type="text" 
             placeholder="Search..."
             name="searchquery"
             value={searchquery}
             id="search-input"
             onChange={this.handleOnInputChange}/>
             <MappedList listDisplayer = {this.handleSubmit}/>         
              {/* <MappedList listDisplayer = {this.handleLink}/> */}
              {/* <Button  onClick={this.refresh}><i className="redo icon"></i> </Button> */}
             </div>
               </Grid.Column>
               <Grid.Column width={1}>
                 <Grid.Row>
               </Grid.Row>
               </Grid.Column>
               </Grid>
               </Segment>           
               {/* </div> */}
                {message && <p className="message">{message}</p>}

                {/* <Button  primary size='large'
                 onClick={() =>this.setState({AddPageModelstate:true})}>Add Page  
                 <Icon name='plus'/></Button> 
                 <AddPageModel
                 show={this.state.AddPageModelstate}
                 onHide={addModelClose}/> */}
                             
          </Segment>
        </Visibility>
        {children}
      </Responsive>                             
           <img src={ Loader } className={`search-loading ${ loading ? 'show' : 'hide' }`} alt="loader"/>   
         
                {/* <Table className="table">      
                  <tbody>
                  {                                
                    items.map(result=>                  
                        <tr key={result.Title}> 
                         
                      <div className = "row"><td className = "result">
                          {result}</td>
                          
                      <Button primary onClick={this.clickLike}>Likes:{this.state.Likes}</Button>
                      </div>                                    
                        </tr>                        
                      )                   
                 }                    
                  </tbody>
                
                </Table> */}
                
            
                         

 <Grid divided inverted stackable style={{height: '30vh'}}>
          <Grid.Row color='blue'>
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
  <Header inverted as='h4' content='Search Express'/> 
  <p>Search Information related to NAV IT Documents ,Links,
  <n>Functionalities etc.</n>
  </p>
  </Grid.Column>
  <Grid.Column width={3} height={1}> <img src = {invest}  width={100} height={100} alt="Globe" mode='fit' style={{right:0}} float="right"/>
     </Grid.Column>
  </Grid.Row>
  </Grid> 
  </div>      
    )
    
}
}
  export default SearchExpressUI3