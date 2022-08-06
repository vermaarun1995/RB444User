import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-row',
  templateUrl: './table-row.component.html',
  styleUrls: ['./table-row.component.css']
})
export class TableRowComponent implements OnInit {

  constructor() { }

  @Input() tableRowList : any[] = [];
  @Input() multiMarketPin : boolean = false;

  ngOnInit(): void {
  }

}
