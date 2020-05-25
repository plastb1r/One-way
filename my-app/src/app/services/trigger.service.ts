import {Observable, Subject} from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class TriggerService {
    private _trigger = new Subject<void>();
    get trigger$() {
        return this._trigger.asObservable();
    }

    public triggerOnMyButton() {
        this._trigger.next();
    }
}

