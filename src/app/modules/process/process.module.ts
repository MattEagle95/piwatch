import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListComponent } from './list/list.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { CreateComponent } from './create/create.component';
import { ProcessComponent } from './process.component';

@NgModule({
  declarations: [
    ProcessComponent,
    CreateComponent,
    ListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  exports: [
    ProcessComponent,
    CreateComponent,
    ListComponent
  ],
  providers: [],
  entryComponents: [CreateComponent]
})
export class ProcessModule { }
