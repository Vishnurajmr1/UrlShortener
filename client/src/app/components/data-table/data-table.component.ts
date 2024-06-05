import { Component, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
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
    CommonModule,
  ],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
  providers: [MessageService],
})
export class DataTableComponent {
  tableData: IApiUrl[] = [];
  private apiService = inject(ApiService);
  private messageService = inject(MessageService);
  private destroy$ = new Subject<void>();
  shortUrl: string = '';
  cols!: Column[];
  counter: number = 0;
  deleteMessage: string = '';

  ngOnInit(): void {
    this.apiService.urlData$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        if (data != null) {
          this.shortUrl = data.id;
          this.tableData = [...this.tableData, data];
          console.log(this.tableData);
        }
      },
    });

    this.cols = [
      { field: 'shorturl', header: 'ShortUrl' },
      { field: 'sriginalurl', header: 'OriginalUrl' },
      { field: 'qrcode', header: 'QrCode' },
      { field: 'clicks', header: 'Clicks' },
      { field: 'date', header: 'Date' },
      { field: '', header: '' },
    ];
  }
  getUrl(shortId: string): string {
    return `${environment.baseUrl}/url/${shortId}`;
  }
  redirectToUrl(shortId: string,event:MouseEvent) {
    event.stopPropagation();
    this.apiService
      .getShortUrl(shortId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        window.open(response.redirectUrl,'_blank');
        // window.location.href = response.redirectUrl;
      });
  }
  deleteShortUrl(shortId: string) {
    console.log(shortId);
    this.apiService.deleteShortUrl(shortId).subscribe({
      next: (response) => {
        this.deleteMessage = response.message;
        this.messageService.add({
          severity: 'success',
          summary: 'URL deleted',
          detail: this.deleteMessage,
          life: 3000,
        });
        this.tableData = this.tableData.filter((data) => data.id !== shortId);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message,
          life: 3000,
        });
      },
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
