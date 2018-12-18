import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DataService } from '../service/data.service';
import { FormGroup, FormBuilder, FormControl, NgModel } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import {NgxSmartModalModule, NgxSmartModalService} from 'ngx-smart-modal';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, AfterViewInit{
satu: number;
dua: number;
dtOptions: any = {};
formCari: FormGroup;
@ViewChild(DataTableDirective)
dtElement: DataTableDirective;
dtTrigger: Subject<any> = new Subject();
  constructor(private dataService: DataService, private formBuild: FormBuilder, private ngModal: NgxSmartModalService){}

  ngOnInit(): void {
    this.formCari = new FormGroup({
      'nama' : new FormControl()
    });

    const that = this;
    this.dtOptions = {
      ajax: (dataTablesParameters: any, callback)=>{
        const parameter = new Map<string, any>();
        parameter.set('nama', this.formCari.controls.nama.value);
        that.dataService.getListKelas(parameter, dataTablesParameters).subscribe(resp =>{
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
      filter:false,
      columns: [{
        title: 'ID',
        data: 'id',
        orderable: false
      }, {
        title: 'NAMA',
        data: 'nama'
      },{
        title: 'Action',
        orderable: false, //supaya tidak bisa di sort
        render: function(data, type, row){
          return  `<a href="editkelas/${row.id}" type="button" class="btn btn-warning btn-xs edit" data-element-id="${row.id}">
          <i class="glyphicon glyphicon-edit"></i> Edit</button>
          <a href="editkelas/${row.id}" type="button" class="btn btn-danger btn-xs remove" data-element-id="${row.id}">
          <i class="glyphicon glyphicon-remove"></i> Delete</button></a>
          `;
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
      this.ngModal.setModalData(environment.baseUrl + 'listkelas' + target.getAttribute('data-element-id'), 'imageModal');
      this.ngModal.open('imageModal');
    }
    });
    //dom pada angular dihindari untuk dipakai
    //solusi untuk bisa ada action di edit dan delete yang ada di render
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

  ngAfterViewInit(){
    this.ngModal.getModal('imageModal').onCloseFinished.subscribe((event: Event)=>{
      this.ngModal.resetModalData('imageModal');
    })
  }

  cari(): void{
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api)=>{
      dtInstance.draw();
    });
  }


  tambah(satu:number, dua:number):number{
    return satu+dua;
  }

}

