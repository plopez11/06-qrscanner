import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { DataLocalService } from '../../services/data-local.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  slidesOpts = {
    allowSlidePrev: false,
    allowSlideNext: false
  };

  constructor(private barcodeScanner: BarcodeScanner,
              private datalocalsrv: DataLocalService) {}

  ionViewWillEnter() {
    this.scan();
  }

  scan() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      if (!barcodeData.cancelled) {
        this.datalocalsrv.guadarRegistro(barcodeData.format, barcodeData.text);
      }
     }).catch(err => {
         console.log('Error', err);
        //  solo para probar
        // this.datalocalsrv.guadarRegistro('QRCode','https://fernando-herrera.com');
         this.datalocalsrv.guadarRegistro('QRCode', 'geo:10.458912,-66.746650');
        });
  }

}
