import {ViewChild, Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {Kelas} from '../model/kelas.model';
import {DataService} from '../service/data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import { NgxSmartModalService } from 'ngx-smart-modal';
import {environment} from '../../environments/environment';
import {CategoryModal} from '../model/categorymodal.component';

@Component({
  selector: 'addkelas-app',
  templateUrl: './addkelas.html'
})
export class AddKelasComponent implements OnInit {
  tambahKelas: FormGroup;
  selectedFile = FileList;
isEdit : boolean;
  constructor(private formBuild: FormBuilder, private rute: Router,
              private route: ActivatedRoute, private dataService: DataService, private toastr: ToastrService, private ngModal : NgxSmartModalService) {
  }

  ngOnInit(): void {
    this.tambahKelas = this.formBuild.group
    ({
      'nama': ['', [Validators.required, Validators.minLength(5)]]
    });

    document.querySelector('body').addEventListener('click', (event) => {
      const target = <Element>event.target;
      if (target.tagName.toLowerCase() === 'button' && $(target).hasClass('CategoryModal')) {
      this.ngModal.setModalData(environment.baseUrl + 'listkelas' + target.getAttribute('data-element-id'), 'categoryModal');
      this.ngModal.open('categoryModal');
    }
    });

    // this.route.params.subscribe(rute=>{
    //   if(hasilrute.id) {
    //     this.isEdit = true;
    // this.dataService.getKategoriById(hasilrute.id).subscribe(data+>{
    // this.applyFormValues(this.tambahKelas,data);
    // }
    //   }
    //
    // })

  }

  simpanData(): void {
    const kat = new Kelas();
    kat.nama = this.tambahKelas.controls.nama.value;
    this.dataService.getSimpanKelas(kat, this.isEdit).subscribe(
      res => {
        // console.log(res);
        // this.toastr.success(res.pesan, 'info');

        console.log('sukses dulu baru');
        this.upload(kat.id);
      },
      err => {
        console.log('error');
      },
      () => {

      }

    );
  }

  selectFile(event: any) {
    this.selectedFile = event.target.files;
  }

  upload(idkey) {
    if (this.selectFile) {
      this.dataService.pushFileToStorage(this.selectedFile[0], idkey).subscribe(res => {
          console.log('Done!');
        },
        err => {
          console.log(err);
          this.toastr.error(err, 'ERROR!');
        },
        () => {
          console.log('upload complete');
        });
    }

  }

  ngAfterViewInit(){
    this.ngModal.getModal('categoyModal').onCloseFinished.subscribe((event: Event)=>{
      this.ngModal.resetModalData('categoryModal');
    })
  }





  eventFromModal(datax){
    console.log('===> '+datax);
    const data = datax.split('|');
    this.tambahKelas.controls.id.setValue=data[0];
    this.tambahKelas.controls.name.setValue(data[1]);
  }

}

// <addkategori-app></addkategori-app>
