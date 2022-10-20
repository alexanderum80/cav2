export interface ISelectableList {
    value: number | string | boolean;
    description: string;
}

export const YesNoOptions: ISelectableList[] = [
    { value: true, description: 'Yes' },
    { value: false, description: 'No' },
];

export const DEFAULT_LENGTH_DISTANCE_ID = 4;
export const DEFAULT_DISTANCE_UOM_TYPE = 'bigger';

export const hybridNote = `Svp écrire « H » sur la fenêtre et prendre les gants de classe 0 si le véhicule est accidenté seulement. 
Please write on the window "H". Use glove class 0 if the car is accidented`;

export const charityNote = ``;

export const goodForSaleNote = `SVP Écrire « CC » et le prix d’achat sur la fenêtre conducteur. Ne pas lever avec le loader, et déposer la voiture dans l’emplacement attitré au voiture pour la revente. Avertir le gérant du site dès l’arrivée du véhicule dans la cour.
Please write "CC" and the purchase price on driver window. Do not lift with the loader and  drop the car in the car for sale dedicated area. Advise the site manager once the car has arrived on site.`;

export const towingNote = `VIN or Plate:
Name of garage:
Opening hours:`;
