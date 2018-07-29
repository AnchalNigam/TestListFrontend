import { Component, OnInit } from '@angular/core';
import { ListService } from './../list.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  public listName:string;

  constructor(public router: Router,private edListService:ListService,
    private toastr: ToastrService,) { }

  ngOnInit() {
  }

  //method to ccreate to-do-list
  public createList=()=>{
    let data={
      'listName':this.listName,
      
    }//end data

    console.log(data);
    this.edListService.createTodoList(data).subscribe(
      Response=>{
        if(Response.status===200){
          
          this.toastr.success('Successfully List Created!')
          setTimeout(()=>{
             this.router.navigate(['/todolist']);
          },2000)
        }
        else{
          this.toastr.error(Response.message);
        }
      },
      error=>{
        this.toastr.error('Some Error Occured!');
      }
    )



  }

}
