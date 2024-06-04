import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ApiService } from '../../services/api.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-url-form',
  standalone: true,
  imports: [
    FormsModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextareaModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './url-form.component.html',
  styleUrl: './url-form.component.scss'
})
export class UrlFormComponent {
  urlForm!: FormGroup;
  private fb = inject(FormBuilder);
  private apiUrl = inject(ApiService);
  private destroy$ = new Subject<void>();
  urlValue: string = '';
  ngOnInit(): void {
    this.urlForm = this.fb.group({
      url: ['', [Validators.required, this.urlValidator]],
    });
  }

  urlValidator(control: AbstractControl) {
    const urlPattern =
      /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    return urlPattern.test(control.value) ? null : { invalidUrl: true };
  }
  onSubmit() {
    if (this.urlForm.valid) {
      const urlValue = this.urlForm.get('url')?.value;
      console.log('Submitted URL:', urlValue);
      this.apiUrl
        .createUrl(urlValue)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            console.log(res);
            this.apiUrl.setData(res);
          },
          error(err) {
           console.error(err);
          },
        });
      this.urlForm.reset();
    }
  }

  get urlControl() {
    return this.urlForm.get('url');
  }
}
