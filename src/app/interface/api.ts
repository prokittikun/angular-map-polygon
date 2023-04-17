export interface marker {
    lat: number;
    lng: number;
    label?: string;
    draggable: boolean;
}
export interface newPath {
    lat: number;
    lng: number;
    sum: number
    status: boolean
    index: number
}
