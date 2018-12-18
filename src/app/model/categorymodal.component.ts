import {Component, OnInit, ViewChild, EventEmitter, Output} from '@angular/core';
import {DataService} from '../service/data.service';
import {FormGroup, FormBuilder, FormControl, NgModel} from '@angular/forms';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {NgxSmartModalModule, NgxSmartModalService} from 'ngx-smart-modal';
import {environment} from '../../environments/environment';
import {NgSelectMultipleOption} from '@angular/forms/src/directives';

@Component({
  selector: 'category-modal'
})
export class CategoryModal implements OnInit {

  @Output() sendDataTo = new EventEmitter<string>();

  dtOptions: any = {};
  formCari: FormGroup;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();

  constructor(private dataService: DataService, private formBuild: FormBuilder, private ngModal: NgxSmartModalService) {
  }

  ngOnInit(): void {
    this.formCari = new FormGroup({
      'nama': new FormControl()
    });

    const that = this;
    this.dtOptions = {
      ajax: (dataTablesParameters: any, callback) => {
        const parameter = new Map<string, any>();
        parameter.set('nama', this.formCari.controls.nama.value);
        that.dataService.getListKelas(parameter, dataTablesParameters).subscribe(resp => {
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: resp.data,
            draw: resp.draw
          });
        });
      },
      serverSide: true,
      processing: true,
      filter: false,
      columns: [{
        title: 'ID',
        data: 'id',
        orderable: false
      }, {
        title: 'NAMA',
        data: 'nama'
      }, {
        title: 'Action',
        orderable: false,
        render: function (data, type, row) {
          return `<a href="editkelas/${row.id}" type="button" class="btn btn-xs" data-element-id="${row.id}">
          <i class="glyphicon glyphicon-edit"></i> Edit</button>`;
        }
      }],
      'rowCallback': function (row, data, dataIndex) {
        const idx = ((this.api().page()) * this.api().page.len()) + dataIndex + 1;
        $('td:eq(0)', row).html('<b>' + idx + '</b>');
      }

    };

    document.querySelector('body').addEventListener('click', (event) => {
      const target = <Element>event.target;
      if (target.tagName.toLowerCase() === 'button' && $(target).hasClass('image')) {
        this.ngModal.setModalData(environment.baseUrl + 'listkelas' + target.getAttribute('data-element-id'), 'categoryModal');
        this.ngModal.open('categoryModal');
      }
    });

    /*document.querySelector('body').addEventListener('click', (event) => {
      const target = <Element>event.target;
      if (target.tagName.toLowerCase() === 'button' && $(target).hasClass('edit')) {

        console.log('ini edit' + target.getAttribute('data-element-id'));




      }
      if (target.tagName.toLowerCase() === 'button' && $(target).hasClass('remove')) {
        console.log('ini delete' + target.getAttribute('data-element-id'));

      }
    });*/


  }

  ngAfterViewInit() {
    this.ngModal.getModal('imageModal').onCloseFinished.subscribe((event: Event) => {
      this.ngModal.resetModalData('imageModal');
    });
  }

  cari(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }


}

