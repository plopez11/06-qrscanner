import { Component } from '@angular/core';
import { DataLocalService } from '../../services/data-local.service';
import { Registro } from '../../models/registro.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  guardados: Registro[] = [];

  constructor(public datalocalSrv: DataLocalService) {
    this.datalocalSrv.cargaStorage();

  }

  enviarCorreo() {
      this.datalocalSrv.enviarcorreo();
  }

  abrirRegistro( registro: Registro) {
    // console.log('Registro', registro);
    this.datalocalSrv.abrirRegistro(registro);
  }

}
