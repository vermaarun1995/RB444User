import { Component, OnInit } from '@angular/core';
import { ResponseModel } from 'src/app/models/responseModel';
import { HttpService } from 'src/app/services/http.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  active = 4;
  sportData : any;
  sportNews : SportNews[] = [];

  constructor(private service : HttpService) {}  

  getEventsData:any = (sportId:number) =>{
    this.service.get(`exchange/GetSportEvents?SportId=${sportId}`)
    .subscribe((response:ResponseModel) => {
      if(response.isSuccess == true && response.data != null){
        this.sportData = response.data;
      }
    });
  }

  navChange($event:any){
  }
  activeIdChange($event:any){
    this.sportData = "";
    this.getEventsData($event);
  }

  getAllNews(): void {
    this.service.get(`Common/GetAllNews`)
    .subscribe((response:ResponseModel) => {
      if(response.isSuccess == true && response.data != null){
        this.sportNews.push(...response.data);
      }
    });
  }
  ngOnInit(): void {
    this.getEventsData(4);
    this.getAllNews();
  }
}

interface SportNews{
    newsText:string;
    status:boolean;
}