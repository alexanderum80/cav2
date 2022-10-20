import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class ModalService {

    private _config = {
        disableClose: true
    };

    constructor(
        private _dialog: MatDialog
    ) {}

    openModal(component: any) {
        this._dialog.open(component, this._config);
    }

    closeModal() {
        this._dialog.closeAll();
    }
}
