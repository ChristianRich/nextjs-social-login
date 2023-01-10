// Slimmed-down version of the User API User type
export interface UserAccountProfile {
  id: string;
  name: string;
  handle: string;
  email: string;
  accountType: string;
  status: string;
  provider?: string;
  profile: {
    profileData: {
      avatarUrl: string;
      currency: string;
      lang: string;
    };
  };
}

// user?: User | AdapterUser {
//   id: '212d11a3-e676-441b-a247-4147a16aaa74',
//   name: 'dood.dood',
//   handle: '@DoodDood',
//   createdAt: '2023-01-10T07:20:21.299Z',
//   lastLoginAt: '2023-01-10T10:39:04.610Z',
//   email: 'dood@dood.com',
//   role: 'USER',
//   status: 'UNCONFIRMED',
//   accountType: 'CREDENTIALS',
//   sourceSystem: 'slshub.com',
//   profile: {
//     profileData: {
//       lang: 'en_us',
//       avatarUrl: 'https://s3.ap-southeast-2.amazonaws.com/dev.id-api.static-assets/avatars/x256/01.png',
//       currency: 'USD'
//     },
//     badges: [ [Object] ],
//     data: {}
//   },
//   '$devTest': { activationCode: '07p11bTOSTjwz0qP2CCTg' }
// }
