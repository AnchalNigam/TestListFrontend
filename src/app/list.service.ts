import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient,HttpParams,HttpErrorResponse,HttpHeaders} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ListService {

  public baseUrl="http://localhost:3004/api/v1";
  
  constructor(private http: HttpClient) { 
   
  }

  //method to create todolist
 public createTodoList=(data):Observable<any>=>{
  const params = new HttpParams()
  .set('listName', data.listName)
  

   return this.http.post(`${this.baseUrl}/lists/create`,params);
 }//end

//method too get all todolist
public getAllToDo=():Observable<any>=>{
  return this.http.get(`${this.baseUrl}/lists/get/all/lists`);

}//end

//method to get all items of particular list
public getItems=(listId): Observable<any> =>{   //

  return this.http.get(`${this.baseUrl}/lists/get/tree/${listId}`);
    
} //end

//method to save a item/subitem of list
public saveItem=(data):Observable<any>=>{
  console.log(data.IdOfParent);

  const params = new HttpParams()
  .set('itemId', data.id)           //id of adding item/subitems
  .set('itemName', data.name)       //name of adding item/subitems
 
  return this.http.post(`${this.baseUrl}/lists/create/items/${data.IdOfParent}`,params);

}

}
