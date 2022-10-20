import { ModalService } from '../../services/modal.service';
import { FormGroupService } from '../../services/form-group.service';
import { ShowMoreService } from '../../services/show-more.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-show-more',
  templateUrl: './show-more.component.html',
  styleUrls: ['./show-more.component.scss']
})
export class ShowMoreComponent implements OnInit {
  title = this._showMoreSvc.title;
  data = this._showMoreSvc.data;
  columns = this._showMoreSvc.columns;

  constructor(
    private _showMoreSvc: ShowMoreService,
    private _fgSvc: FormGroupService,
    private _modalSvc: ModalService
  ) { }

  ngOnInit(): void {
  }

  updateSelectedData(row: any) {
    this._fgSvc.fg.controls[this._showMoreSvc.fgField].setValue(row.id);
    this._modalSvc.closeModal();
  }

}
