import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ResponseModel } from './models/responseModel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'RB444-Angular';

  constructor(private store : Store<{StackData : ResponseModel}>){
  }

  ngOnInit(): void {
    this.store.dispatch({ type : "GET_STACK" })
  }

}
