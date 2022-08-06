import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { ResponseModel } from 'src/app/models/responseModel';
import { StackLimit } from 'src/app/models/stackLimit';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-match-odds',
  templateUrl: './match-odds.component.html',
  styleUrls: ['./match-odds.component.css']
})
export class MatchOddsComponent implements OnInit {

  @Input() sportId? : number;
  @Input() matchOddsData?: any[];
  @Input() isUserLogin?: boolean;
  @Input() inPlay?: boolean;

  stackData? : Observable<StackLimit[]>;
  stackLimitList : StackLimit[] = [];

  matchOddsForm : FormGroup;  

  exEventId?: number;
  exMarketId?: number;
  selectionId?: number;
  selectedIndex?: number;
  oddsSlip?: string;
  selectedValue?: number;
  runnerName? : string;


  bidPriceInput: number = 0;
  bidOddPrice: number = 0;
  oddBook: boolean = false;
  oddBookPrice: number = 0;

  constructor(
    private service: HttpService, 
    private sessionService : SessionService, 
    private notification : NotificationService, 
    private activatedRoute: ActivatedRoute, 
    private authService: AuthService,  
    private fb : FormBuilder,
    private store : Store<{StackData : StackLimit[]}>
    ) {

    this.matchOddsForm = this.fb.group({
      sportId : [this.sportId],
      EventId : [''],
      event : [''],
      MarketId : [''],
      market : [''],
      selection : [''],
      selectionId : [],
      OddsType : [1],
      type : [''],
      oddsRequest : [''],
      amountStake : [''],
      betType : [],
      isSettlement : [2]
    })
    this.stackData = this.store.select(data => data.StackData);
   }

  openOrderRow: any = (index: number, exEventId: number, exMarketId: number, selectionId: number, slip: string, price: number, runnerName : string) => {
    let userId = this.sessionService.getLoggedInUser().id;
    this.service.get(`BetApi/GetBackAndLayBetAmount?UserId=${userId}&marketId=${exMarketId}`)
    .subscribe((response:ResponseModel) => {
      if(response.isSuccess == true && response.data != null){
        let resData = response.data.split("|");
        this.oddBook = true;
        this.oddBookPrice = parseInt(resData[0]);
        this.bidOddPrice = parseInt(resData[1]);
      }    
    });

    this.selectedIndex = index;
    this.exEventId = exEventId;
    this.exMarketId = exMarketId;
    this.selectionId = selectionId;
    this.oddsSlip = slip;
    this.bidPriceInput = price;
    this.runnerName = runnerName;


    this.matchOddsForm.patchValue({
      betType : this.selectedIndex,
      selectionId : this.selectionId,
      selection : this.runnerName,
      type : this.oddsSlip,
      sportId : this.sportId

    })

  }

  ngOnInit() {
    this.stackData?.subscribe((stack:StackLimit[]) => {
      if (stack.length > 0) {
        this.stackLimitList = stack;
      }
    });
  }

  /******** Match Odds Bid Price *******/


  setBidPrice($event: any) {
    if (typeof $event == 'object') {
      this.bidOddPrice += $event.target.value;
    } else {
      this.bidOddPrice += $event;
    }
    this.oddBookPrice += Math.ceil(this.bidPriceInput * this.bidOddPrice) - this.bidOddPrice;
    this.oddBook = true;
  }

  numberPlus(input: number) {
    console.log(input)
  }
  numberMinus(input: number) {
    console.log(input)
  }

  saveMatchOdds(){

    let userId = this.sessionService.getLoggedInUser().id;
    let placeBetData = {
      "id" : 0,
      "sportId": parseInt(this.matchOddsForm.value.sportId),
      "EventId": parseInt(this.matchOddsForm.value.EventId),
      "event": this.matchOddsForm.value.event,
      "MarketId": this.matchOddsForm.value.MarketId,
      "market": this.matchOddsForm.value.market,
      "selection": this.matchOddsForm.value.selection,
      "OddsType": this.matchOddsForm.value.OddsType,
      "type": this.matchOddsForm.value.type,
      "oddsRequest": this.matchOddsForm.value.oddsRequest,
      "amountStake": this.matchOddsForm.value.amountStake,
      "betType": this.matchOddsForm.value.betType,
      "isSettlement": this.matchOddsForm.value.isSettlement,
      "userId": userId,
      "SelectionId" : this.matchOddsForm.value.selectionId
    }

    this.service.post('BetApi/SaveBets', placeBetData)
    .subscribe((response:ResponseModel) => {
        if(response.isSuccess == true){
          this.notification.showSuccess(response.message);
          this.authService._isLoginUser.next(true);
        }else{
          this.notification.showError(response.message);
        }
      });
  }

}
