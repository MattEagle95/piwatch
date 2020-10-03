import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/shared/api.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent {

  form = this.fb.group({
    name: ['', Validators.required],
    script: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private apiService: ApiService, public activeModal: NgbActiveModal) { }

  onSubmit() {
    this.apiService.start(this.form.get('name').value, this.form.get('script').value)
      .subscribe((data) => {
        console.log(data);
      });
  }

}
