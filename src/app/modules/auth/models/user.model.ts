import { AuthModel } from './auth.model';
import { AddressModel } from './address.model';
import { SocialNetworksModel } from './social-networks.model';

export class UserModel extends AuthModel {
  id: number;
  role: number;
  name: string;
  status: string;
  uuid: number;

  setUser(_user: unknown) {
    const user = _user as UserModel;
    this.id = user.id;
    this.role = user.role;
    this.name = user.name || '';
    this.status = user.status || '';
    this.accessToken = user.accessToken || '';
    this.uuid = user.uuid || 0;
  }
}
