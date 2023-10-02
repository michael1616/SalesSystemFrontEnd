import { PermissionsAction } from "./permissions-action";

export interface Role {
    id?:string,
    name:string,
    registrationDate?: Date,
    permissions: PermissionsAction[]
}
