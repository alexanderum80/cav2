import { environment } from '../../../environments/environment';
import { HttpHeaders } from '@angular/common/http';

export const headers = new HttpHeaders({
    'Content-Type': 'application/json',
});

export const auth_url = environment.odooUrl + 'web/session/authenticate';
export const searchURL =  environment.odooUrl + 'web/dataset/search_read';
export const createURL =  environment.odooUrl + 'web/dataset/call_kw/{}/create';
export const writeURL =  environment.odooUrl + 'web/dataset/call_kw/{}/write';
export const functionURL =  environment.odooUrl + 'web/dataset/call_kw';

export const DEFAULT_RECORD_LIMIT = 7;

export const wizardModel = 'crm.purchase.lead.wizard.test';
export const opportunityModel = 'crm.purchase.lead';
export const phoneCallModel = 'crm.phonecall';
