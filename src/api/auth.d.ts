interface UserData {
   auth_provider: string;
   user: {
      id: number;
      first_name: string;
      last_name?: string;
      auth_date: number;
      hash: string;
      photo?: string;
      username?: string;
   };

}
interface Tokens {
   accessToken: string;
   refreshToken: string;
}
export function login(userData: UserData): Promise<Tokens>