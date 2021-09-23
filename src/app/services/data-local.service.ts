import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {
  guardados: Registro[] = [];

  constructor(private storage: Storage,
              private natctrl: NavController,
              private iab: InAppBrowser,
              private file: File,
              private emailComposer: EmailComposer) {
    this.cargaStorage();
  }

  async guadarRegistro(format: string, text: string) {

    await this.cargaStorage();

    const nuevoRegistro =  new Registro(format, text);
    this.guardados.unshift(nuevoRegistro);
    // set a key/value
    this.storage.set('registro', this.guardados);
    this.abrirRegistro(nuevoRegistro);

  }

  async cargaStorage() {
    this.guardados = await this.storage.get('registro') || [];
  }

  abrirRegistro( registro: Registro) {

    this.natctrl.navigateForward('/tabs/tab2');

    switch ( registro.type) {
         case 'http':
         this.iab.create(registro.text, '_system');
         break;

         case 'geo':
         this.natctrl.navigateForward(`/tabs/tab2/mapa/${registro.text}`);
         break;
    }
  }

  enviarcorreo() {
    const arregloTmp = [];
    const titulo = 'Titulo, Formato, Creado en, Texto\n';

    arregloTmp.push(titulo);

    this.guardados.forEach( registro => {
      const linea = `${registro.type} , ${registro.format} , ${registro.created} , ${registro.text.replace(',', ' ')}\n`;
      arregloTmp.push(linea);
    });
    // console.log(arregloTmp.join(''));
    this.crearArchivoFisico(arregloTmp.join(''));

  }

  crearArchivoFisico(text: string) {
    this.file.checkFile(this.file.dataDirectory, 'registros.csv')
    .then(existe => {
      return this.escribirEnArchivo(text);
    })
    .catch (err => {
      this.file.createFile( this.file.dataDirectory, 'registros.csv', false)
          .then( creado => {
            return this.escribirEnArchivo(text);
          })
          .catch( err2 => {console.log('fallo la escritura del archivo');
        });
    });
  }

  async escribirEnArchivo(text: string) {

      await this.file.writeExistingFile(this.file.dataDirectory, 'registro.csv', text);
      const archivo = `${this.file.dataDirectory}/registros.csv`;

      const email = {
        to: 'pedrolopeze11@gmail.com',
        // cc: 'erika@mustermann.de',
        // bcc: ['john@doe.com', 'jane@doe.com'],
        attachments: [
          archivo
        ],
        subject: 'Backup de Scaan',
        body: 'Aqui tiene su backup de los scann - <strong>QrScannerApp</strong> ',
        isHtml: true
      };
      this.emailComposer.open(email);
  }
}
