import { BaseEntity } from './BaseEntity';
import { League } from './League';
export declare class Sport extends BaseEntity {
    name: string;
    slug: string;
    icon?: string;
    description?: string;
    sort_order: number;
    is_active: boolean;
    leagues: League[];
    generateSlug(): void;
    getActiveLeagues(): Promise<League[]>;
}
//# sourceMappingURL=Sport.d.ts.map