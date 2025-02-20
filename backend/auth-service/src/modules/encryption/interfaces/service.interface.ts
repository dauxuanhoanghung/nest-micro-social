export const ENCRYPTION_SERVICE = 'ENCRYPTION_SERVICE';

export interface IEncryptionService {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}
