import { BaseEntity as TypeORMBaseEntity } from 'typeorm';
export declare abstract class BaseEntity extends TypeORMBaseEntity {
    id: string;
    created_at: Date;
    updated_at: Date;
}
//# sourceMappingURL=BaseEntity.d.ts.map