import { writeURL, createURL, DEFAULT_RECORD_LIMIT } from '../models/odoo.model';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { functionURL, searchURL } from '../models/odoo.model';

@Injectable({
  providedIn: 'root'
})
export class OdooService {

  constructor(
    private httpClient: HttpClient,
    private _userService: UserService,
  ) { }

  // tslint:disable-next-line: max-line-length
  public async searchValues(_model: string, _domain: any[] = [], _fields: any[] = [], _limit = DEFAULT_RECORD_LIMIT, _sort = []): Promise<any> {
    const body = {
      'Content-Type': 'application/json',
      'X-Openerp-Session-Id': this._userService.user.session_id,
    };

    const params = {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        model: _model,
        domain: _domain,
        fields: _fields,
        limit: _limit,
        sort: _sort,
        context: this._userService.user.user_context
      }
    };

    const resp = await this.httpClient.post<any>(searchURL, params, { headers: body }).toPromise();

    return resp;
  }

  public async callMethod(_modelDB: string, _methodName: string, _args: any[]) {
    const body = {
      'Content-Type': 'application/json',
      'X-Openerp-Session-Id': this._userService.user.session_id,
    };
    const params = {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        args: _args,
        method: _methodName,
        kwargs: {
          context: this._userService.user.user_context
        },
        model: _modelDB
      }
    };

    const resp = await this.httpClient.post<any>(functionURL + '/' + _modelDB + '/' + _methodName, params, { headers: body }).toPromise();

    return resp;
  }

  public async createMethod(_modelDB: string, _args: any) {
    const body = {
      'Content-Type': 'application/json',
      'X-Openerp-Session-Id': this._userService.user.session_id,
    };

    const params = {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        args: [_args],
        method: 'create',
        kwargs: {
          context: this._userService.user.user_context
        },
        model: _modelDB
      }
    };

    const resp = await this.httpClient.post<any>(createURL.replace('{}', _modelDB), params, { headers: body }).toPromise();

    return resp;
  }

  public async writeMethod(_modelDB: string, id: number, _args: any) {
    const body = {
      'Content-Type': 'application/json',
      'X-Openerp-Session-Id': this._userService.user.session_id,
    };

    const params = {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        args: [id, _args],
        method: 'write',
        kwargs: {
          context: this._userService.user.user_context
        },
        model: _modelDB
      }
    };

    const resp = await this.httpClient.post<any>(writeURL.replace('{}', _modelDB), params, { headers: body }).toPromise();

    return resp;
  }
}
