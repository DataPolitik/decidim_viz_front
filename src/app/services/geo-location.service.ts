import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Based on https://stackblitz.com/edit/angular-osm
 */

const GEOLOCATION_ERRORS = {
  'errors.location.unsupportedBrowser': 'Browser does not support location services',
  'errors.location.permissionDenied': 'You have rejected access to your location',
  'errors.location.positionUnavailable': 'Unable to determine your location',
  'errors.location.timeout': 'Service timeout has been reached'
};

@Injectable()
export class GeoLocationService {

  public getLocation(geoLocationOptions?: any): Observable<any> {
    geoLocationOptions = geoLocationOptions || { timeout: 5000 };

        return Observable.create((observer: { next: (arg0: GeolocationPosition) => void; complete: () => void; error: (arg0: string) => void; }) => {

          if (window.navigator && window.navigator.geolocation) {
            window.navigator.geolocation.getCurrentPosition(
              (position) => {
                observer.next(position);
                observer.complete();
              },
              (error) => {
                switch (error.code) {
                  case 1:
                    observer.error(GEOLOCATION_ERRORS['errors.location.permissionDenied']);
                    break;
                  case 2:
                    observer.error(GEOLOCATION_ERRORS['errors.location.positionUnavailable']);
                    break;
                  case 3:
                    observer.error(GEOLOCATION_ERRORS['errors.location.timeout']);
                    break;
                }
              },
              geoLocationOptions);
        } else {
              observer.error(GEOLOCATION_ERRORS['errors.location.unsupportedBrowser']);
        }

        });



      }
    }

    export let geolocationServiceInjectables: Array<any> = [
      {provide: GeoLocationService, useClass: GeoLocationService }
    ];
