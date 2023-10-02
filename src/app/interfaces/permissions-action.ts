export interface PermissionsAction {
    idPermission: number;
    idPermissionAction: number;
    action: string;
    idPadre?: number;
    idRole: string;
    state: boolean;
    idMenu?: number;
    isDisabled:boolean;
    childrenActions: PermissionsAction[]
}
