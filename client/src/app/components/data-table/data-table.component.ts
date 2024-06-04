import { Component, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService, SelectItem } from 'primeng/api';
import { QrCodeModule } from 'ng-qrcode';
import { ApiService } from '../../services/api.service';
import { IApiUrl } from '../../shared/models/api';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { Column } from '../../shared/models/table';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    TableModule,
    ToastModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    QrCodeModule,
    CommonModule
  ],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
  providers: [MessageService],
})
export class DataTableComponent {
  tableData: IApiUrl[] = [];
  private apiService = inject(ApiService);
  private destroy$ = new Subject<void>();
  shortUrl: string = '';
  cols!:Column[];
  counter:number=0;


  ngOnInit(): void {
    this.apiService.urlData$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        if (data != null) {
          this.shortUrl = data.id;
          this.tableData.push(data);
          console.log(this.tableData);
        }
      },
    });

    this.cols=[
      {field:'shorturl',header:'ShortUrl'},
      {field:'sriginalurl',header:'OriginalUrl'},
      {field:'qrcode',header:'QrCode'},
      {field:'clicks',header:'Clicks'},
      {field:'date',header:'Date'},
      // {field:'',header:''}
    ]
  }
  getUrl(): string {
    return `${environment.baseUrl}/url/${this.shortUrl}`;
  }
  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }

}
