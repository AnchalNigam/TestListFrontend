import { Component, OnInit } from '@angular/core';
import { ListService } from './../list.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import * as shortid from 'shortid';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  public allToDoList:any=[];
  public itemList:any=[];
  public dubItemList:any=[];
  public selectedListId:any;
  public itemText:any;
  public subItemText:any;
  public scrollToChatTop:boolean;
  public subItemAddition:boolean=false;
  public id:any;


  constructor(private listService:ListService,
    private toastr: ToastrService, private cookieService: CookieService) { }

  ngOnInit() {
    this.getAllList();
  }

  //method to get all the list
  public getAllList=()=>{
    this.listService.getAllToDo().subscribe(
      Response=>{
        if(Response.status===200){
          this.allToDoList=Response.data;
        }
        else{
          this.toastr.error(Response.message);
        }
      },
      error=>{
        this.toastr.error('Server Error Occured!');
      }
    )

  }//end

//method - when list selected
public listSelected=(list)=>{
  console.log('click');
  this.allToDoList.map((val)=>{
     if(val.id==list.id){
        val.active=true;
     }
     else{

      val.active=false;
     }
  });//end map
  
this.itemList = [];
this.selectedListId=list.id;
this.getPreviousItems();   

}//end

//methid to get previous items
public getPreviousItems=()=>{
  let previousData = (this.itemList.length > 0 ? this.itemList.slice() : []);
  this.listService.getItems(this.selectedListId)
  .subscribe((apiResponse) => {


    if (apiResponse.status == 200) {
     
      this.dubItemList = previousData.concat(apiResponse.data);
     
      if(this.dubItemList[0].hasOwnProperty('children')){
          this.modifyItemList(this.dubItemList[0].children);
      }

      else{
        this.itemList = previousData;
        this.toastr.warning('No Messages available')
      }


    } else {

      this.itemList = previousData;
      this.toastr.warning('No Messages available')

     

    }

    
  }, (err) => {

    this.toastr.error('some error occured')


  });

}//end


//method to modify the data comes from api and store in my itemList
public modifyItemList=(data)=>{
  for(let i in data){
  
    let level="o";
    for(let k=0;k<data[i].depth-1;k++){
      level+=".o";
    }
    let itemData={
      "id":data[i].id,
      "name":data[i].name,
      "level":level
    }
    this.itemList.push(itemData);
    if(data[i].children){
      this.modifyItemList(data[i].children);
    }
  }
 
}//end

//methid to send message using enter
public sendItemUsingKeypress: any = (event: any) => {
 
  if (event.keyCode === 13) { // 13 is keycode of enter.
    
    if(this.subItemAddition==true){
      this.sendSubItem();
    }
    else{
      this.sendItem();
    }
  
  }

} // end sendMessageUsingKeypress

//Method to send message
public sendItem: any = () => {

  if(this.itemText){
    let itemData={
      "id" : shortid.generate(),  //this is item id
      "name":this.itemText,        //this is name of item of list
      "IdOfParent":this.selectedListId
    };
    console.log(itemData)
   this.listService.saveItem(itemData).subscribe(
     Response=>{
       if(Response.status==200){
         this.toastr.success('Item added successfully!')
       }
       else{
        this.toastr.warning('Error Occured')
       }

     },
     err=>{
      this.toastr.warning('Error Occured');
     }
   )
    this.pushToItemWindow(itemData);
  }
  else{
    this.toastr.warning('Text message can not be empty')

  }

} // end sendMessage

//Method to push your items to item window
public pushToItemWindow : any =(data)=>{
  data.level="o"
  this.itemText="";
  this.itemList.unshift(data);
  this.scrollToChatTop = true;


}// end push to chat window

//method to add subitem
public addSubItem=(parentId,level)=>{
  this.subItemAddition=true;
  let parentData={
    "parentId":parentId,
    "level":level
  }
  this.cookieService.set('parentData',JSON.stringify(parentData));
  this.id=parentId;
 
}//end

//method to add subitem
public sendSubItem=()=>{
  let parentData:any=JSON.parse(this.cookieService.get('parentData'));
  if(this.subItemText){
  let subItemObj={
    "id" : shortid.generate(),  //this is subitem id
    "name":this.subItemText,        //this is name of subitem of list
    "IdOfParent":parentData.parentId,
    "level": parentData.level+".o"
  }//end subitem obj

  console.log(subItemObj)
  let i=0;
  for(i;i<this.itemList.length;i++){
    if(this.itemList[i].id==parentData.parentId){
      break;
    }
  }
 
  this.itemList.splice(i+1,0,subItemObj);
  
this.listService.saveItem(subItemObj).subscribe(
  Response=>{
    if(Response.status==200){
      this.toastr.success('SubItem added successfully!')
    }
    else{
     this.toastr.warning('Error Occured')
    }

  },
  err=>{
   this.toastr.warning('Error Occured');
  }
)
this.SubItemWindow();
  }
  else{
    this.toastr.warning('Text message can not be empty')

  }
 
}//end 

//method to push to subitem wincdw and send to otther friends
public SubItemWindow=()=>{

  
  this.subItemAddition=false;
  this.subItemText="";
  this.cookieService.delete('parentData');
  

}//end


}
