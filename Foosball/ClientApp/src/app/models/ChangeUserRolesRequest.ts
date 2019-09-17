export class ChangeUserRolesRequest {
    constructor(email: string, roles: string[]) {
        this.userEmail = email;
        this.roles = roles;
      }
    userEmail: string;
    roles: string[];
  }
