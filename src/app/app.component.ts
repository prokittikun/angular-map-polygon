import { LatLngLiteral } from '@agm/core';
import { Component, Directive, OnInit, ViewChild } from '@angular/core';
import { marker, newPath } from './interface/api';
import inside from 'point-in-polygon-hao';
declare const google: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

// @Directive({
//   selector: 'agm-polygon',
// })

export class AppComponent implements OnInit {
  @ViewChild("map", { static: true }) mapElement: any;
  title = 'polygon';
  zoom: number = 15;
  map: any;
  latitude: number = 0;
  longitute: number = 0;
  index: number = 0;
  lat: any[] = [[1, 1], [1, 2], [2, 2], [2, 1]];
  test: any[] = [[1, 1], [1, 2], [2, 2], [2, 1]];
  coordinates: newPath[] = [
    {
      lat: 9.143440219190985,
      lng: 99.3532487996357,
      sum: 0,
      status: true,
      index: -1
    },
    {
      lat: 9.120390169000867,
      lng: 99.35565205891304,
      sum: 0,
      status: true,
      index: -1
    },


    {
      lat: 9.125305378239045,
      lng: 99.34621068318062,
      sum: 0,
      status: true,
      index: -1
    },
    {
      lat: 9.136152496839046,
      lng: 99.36835500080757,
      sum: 0,
      status: true,
      index: -1
    },
    {
      lat: 9.139372671616691,
      lng: 99.34071751911812,
      sum: 0,
      status: true,
      index: -1
    },
    {
      lat: 9.140372671616691,
      lng: 99.34091751911812,
      sum: 0,
      status: true,
      index: -1
    },

  ];
  result: newPath[] = []
  checkCoord: any[] = [];
  newPath: newPath[] = []
  markers: marker[] = [];
  dLat: number = 0
  dLng: number = 0

  polygon: any[] = [];
  ngOnInit() {
    this.cal();

    console.log(this.result);


    // this.check()
    const mapProperties = {
      center: new google.maps.LatLng(-33.8569, 151.2152),
      zoom: 11,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(
      this.mapElement.nativeElement,
      mapProperties
    );
  }

  onAdd() {
    // var stringToJson = JSON.parse(

    // );
    // this.coordinates.push({ stringToJson });
    // this.latitude = 0;
    // this.longitute = 0;
  }

  onSubmit() {

    const polygon = new google.maps.Polygon({
      paths: this.result,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35
    });
    polygon.setMap(this.map);

    // Create the bounds object
    var bounds = new google.maps.LatLngBounds();

    // Get paths from polygon and set event listeners for each path separately
    polygon.getPath().forEach((path: any) => {
      bounds.extend(path);
    });
    console.log(bounds);

    // Fit Polygon path bounds
    this.map.fitBounds(bounds);
  }

  calcCrow(lat1: number, lon1: number, lat2: number, lon2: number) {
    var R = 6371; // km
    var dLat = this.toRad(lat2 - lat1);
    var dLon = this.toRad(lon2 - lon1);
    var lat1 = this.toRad(lat1);
    var lat2 = this.toRad(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  }

  // Converts numeric degrees to radians
  toRad(Value: number) {
    return Value * Math.PI / 180;
  }

  cal() {

    let x = this.coordinates[this.index]
    let a: newPath[] = []

    this.coordinates.forEach((data, i) => {
      this.coordinates[i].index = i + 1
      if (i !== 0) {
        this.coordinates[i].sum = this.calcCrow(x.lat, x.lng, data.lat, data.lng);
        if (this.coordinates[i].status) {
          a.push(this.coordinates[i])
        }
      }
    });
    a.sort((a, b) => a.sum - b.sum)
    this.coordinates[this.index].status = false
    this.result.push(this.coordinates[this.index])

    const coord: newPath[] = []
    for (const data of a) {
      if (coord.length >= 2) break;
      coord.push(data)
    }
    if (coord[0].sum < coord[1].sum) {
      this.index = this.coordinates.findIndex((data) => data.index === coord[0].index)
    } else {
      this.index = this.coordinates.findIndex((data) => data.index === coord[1].index)
    }
    const c = this.coordinates.filter((data) => {
      return data.status
    })
    if (c.length === 2) {
      if (coord[0].sum < coord[1].sum) {
        this.result.push(coord[0])
        this.result.push(coord[1])
      } else {
        this.result.push(coord[1])
        this.result.push(coord[0])
      }
      this.coordinates.forEach((data, i) => {
        this.coordinates[i].status = false
      })
      console.log(this.result);
      return
    }
    this.cal();
  }

  check() {
    this.polygon = []
    this.result.forEach(data => {
      this.polygon.push([data.lat, data.lng])
    })
    this.polygon.push([this.result[0].lat,this.result[0].lng]);
    console.log('result -> ', [this.polygon]);
    console.log(inside([9.1334999309425, 99.34868154431922], [this.polygon])); // true
  }
}
