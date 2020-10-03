import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, interval, Observable, of, pipe, Subject, throwError, timer } from 'rxjs';
import { delay, flatMap, repeat, takeUntil, repeatWhen, retryWhen, take, concatMap, tap, delayWhen } from 'rxjs/operators';
import { ApiService } from 'src/app/shared/api.service';
import { CreateComponent } from '../create/create.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  processesObs: Subject<Process[]> = new Subject();
  processes: Process[] = [];
  logstr;
  loadingObs: Subject<boolean>[] = [];
  loading: boolean[] = [];

  constructor(private apiService: ApiService, private modalService: NgbModal) { }

  ngOnInit() {
    this.apiService.status()
      .pipe(
        retryWhen(errors => {
          return errors
            .pipe(
              delayWhen(() => timer(1000)),
              tap(() => console.log('retrying...'))
            );
        })
      ).pipe(delay(5000), repeat())
      .subscribe((processes: Process[]) => {
        this.processesObs.next(processes);
        this.processes = processes;
      });
  }

  getProcesses() {
    return this.processes.filter(x => x.name !== 'piwatch');
  }

  getMainProcess() {
    let process = this.processes.filter(x => x.name === 'piwatch');
    if (process && process.length === 1) {
      return process[0];
    }

    return null;
  }

  trackProcess(index, process: Process) {
    if (!process) {
      return index;
    }
    return process.pm2_env.unique_id;
  }

  create() {
    const modalRef = this.modalService.open(CreateComponent);
    modalRef.componentInstance.name = 'World';
  }

  status() {
    this.apiService.status()
      .subscribe((processes: Process[]) => {
        this.processes = processes;
        console.log(processes);
      });
  }

  logs(name: string) {
    this.apiService.logs(name)
      .subscribe((data) => {
        console.log(data);
        this.logstr = data;
      });
  }

  reload(name: string) {
    this.apiService.reload(name)
      .subscribe((data) => {
        console.log(data);
      });
  }

  flush(name: string) {
    this.apiService.reload(name)
      .subscribe((data) => {
        console.log(data);
      });
  }

  checkLoading(action: string, name: string): boolean {
    if (!this.loading[action + '-' + name]) {
      return false;
    }

    return this.loading[action + '-' + name];
  }

  restart(name: string) {
    this.loadingObs['restart-' + name] = new Subject<boolean>();
    this.loading['restart-' + name] = true;

    // this.processesObs.pipe(
    //   delay(1000),
    //   takeUntil(this.loadingObs['restart-' + name])
    // ).subscribe((data) => {
    //   console.log('restart');
    //   if (data.find(x => x.name === name && x.pm2_env.status === 'online')) {
    //     console.log('online');
    //     this.loadingObs['restart-' + name].next(true);
    //     this.loading['restart-' + name] = false;
    //   }
    // });

    this.apiService.restart(name)
      .subscribe((data) => {
        console.log(data);
        this.loading['restart-' + name] = false;
      });
  }

  stop(name: string) {
    this.loadingObs['stop-' + name] = new Subject<boolean>();
    this.loading['stop-' + name] = true;

    this.processesObs.pipe(
      delay(1000),
      takeUntil(this.loadingObs['stop-' + name])
    ).subscribe((data) => {
      console.log('stop');
      if (data.find(x => x.name === name && x.pm2_env.status === 'stopped')) {
        console.log('online');
        this.loadingObs['stop-' + name].next(true);
        this.loading['stop-' + name] = false;
      }
    });

    this.apiService.stop(name)
      .subscribe((data) => {
        console.log(data);
        this.loading['stop-' + name] = false;
      });
  }

}
