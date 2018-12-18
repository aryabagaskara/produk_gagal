import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Kelas } from '../model/kelas.model';
@Injectable()
export class DataService{
    constructor(private httpClient: HttpClient){

    }
    getProjectName(){
        return 'Toko Wedang';
    }
    getListKelas(parameter: Map<string, any>, datatablesParameters: any): Observable<DataTablesResponse> {
        let params = new HttpParams();
        params = params.append('start', datatablesParameters.start);
        params = params.append('length', datatablesParameters.length);
        params = params.append('draw', datatablesParameters.draw);
        params = params.append('order[0][column]', datatablesParameters.order[0]['column']);
        params = params.append('order[0][dir]', datatablesParameters.order[0]['dir']);
        parameter.forEach(function (value, key) {
            params = params.append(key, value);
        });
        return this.httpClient.post(environment.baseUrl + 'listkelas', parameter, { params: params }
        ).pipe(map(data => <DataTablesResponse>data));


    }
    getSimpanKelas(kelas: Kelas, isEdit: boolean): Observable<any>{
        console.log(kelas);
        let url = 'simpankelas';
        if(isEdit=true){
            url = 'updatekelas';
        }//else if(isDelete=true){
        //     url = 'deletekategori';
        // }
        return this.httpClient.post(environment.baseUrl+url,kelas);
    }

    getKelasById(id: number): Observable<Kelas>{
        return this.httpClient.get(environment.baseUrl+'getkelasbyid/' +  id)
        .pipe(map(data => <Kelas>data));

    }
    pushFileToStorage(file: File, id: String): Observable<Object> {
      const formData: FormData = new FormData();
      formData.append('file', file);
      const req = new HttpRequest('POST', environment.baseUrl + 'simpankelas' + id, formData, {
        reportProgress: true,
        responseType: 'text'
      });
      return this.httpClient.request(req);
    }
}
