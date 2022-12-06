import { Transaction } from "sequelize";
import { injectable } from "tsyringe";
import { sequelize } from ".";

@injectable()
export class DatabaseService {
  constructor() { }

  public async runTransaction<type>(callback: (t: Transaction) => Promise<type>): Promise<type | null> {
    const t = await sequelize.transaction();
    
    try {
      const result = await callback(t);
      t.commit();
      return result;
    } catch (error) {
      t.rollback();
      return null;
    }
  }
}
