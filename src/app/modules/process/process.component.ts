import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, interval, Observable, of, pipe, Subject, Subscription, throwError, timer } from 'rxjs';
import { delay, flatMap, repeat, takeUntil, repeatWhen, retryWhen, take, concatMap, tap, delayWhen } from 'rxjs/operators';
import { ApiService } from 'src/app/shared/api.service';

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.css']
})
export class ProcessComponent implements OnInit, OnDestroy {

  id: string;
  process: Process;
  subscriptions: Subscription[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.subscriptions.push(
      this.apiService.describe(this.id)
        .pipe(
          delay(5000),
          repeat(),
          retryWhen(errors => {
            console.warn('no connection...')
            return errors
              .pipe(
                delayWhen(() => timer(5000)),
                tap(() => console.warn('retrying...'))
              );
          })
        )
        .subscribe((process: Process) => {
          this.process = process;
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

}
