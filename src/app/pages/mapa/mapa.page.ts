import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment.prod';

declare var mapboxgl: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit, AfterViewInit {

  constructor( private route: ActivatedRoute) { }
  lat: number;
  lng: number;

  ngOnInit() {
    let geo: any = this.route.snapshot.paramMap.get('geo');
    geo = geo.substr(4);
    geo = geo.split(',');
    this.lat = Number(geo[0]);
    this.lng = Number(geo[1]);
    console.log(this.lat, this.lng);
  }

  ngAfterViewInit() {
    // mapboxgl.accessToken = 'pk.eyJ1IjoicGxvcGV6MTEiLCJhIjoiY2tpNXg0d3B5MDFkdjJybnplYjVnd2xlaiJ9.nSoGg04sdjpyVnrGpu2-7g';
    mapboxgl.accessToken = environment.apikey;
    const map = new mapboxgl.Map({
      style: 'mapbox://styles/mapbox/light-v10',
      center: [this.lng, this.lat],
      zoom: 15.5,
      pitch: 45,
      bearing: -17.6,
      container: 'map',
      antialias: true
      });

      // tslint:disable-next-line: align
      // tslint:disable-next-line: only-arrow-functions
      // tslint:disable-next-line: align
      map.on('load', () => {
          map.resize();
          //market
          new mapboxgl.Marker()
          .setLngLat([this.lng, this.lat])
          .addTo(map);

          const layers = map.getStyle().layers;
          let labelLayerId;
          // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < layers.length; i++) {
            if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
              labelLayerId = layers[i].id;
              break;
            }
          }
          map.addLayer(
            {
              // tslint:disable-next-line: object-literal-key-quotes
              'id': '3d-buildings',
              // tslint:disable-next-line: object-literal-key-quotes
              'source': 'composite',
              'source-layer': 'building',
              // tslint:disable-next-line: object-literal-key-quotes
              'filter': ['==', 'extrude', 'true'],
              // tslint:disable-next-line: object-literal-key-quotes
              'type': 'fill-extrusion',
              // tslint:disable-next-line: object-literal-key-quotes
              'minzoom': 15,
              // tslint:disable-next-line: object-literal-key-quotes
              'paint': {
                'fill-extrusion-color': '#aaa',

                // use an 'interpolate' expression to add a smooth transition effect to the
                // buildings as the user zooms in
                'fill-extrusion-height': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  15,
                  0,
                  15.05,
                  ['get', 'height']
                ],
                'fill-extrusion-base': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  15,
                  0,
                  15.05,
                  ['get', 'min_height']
                ],
                'fill-extrusion-opacity': 0.6
              }
            },
            labelLayerId
          );
        });

  }

}
