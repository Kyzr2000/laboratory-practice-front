export interface SkillType{
    id: number;
    name: string | null; // 允许 name 为 null
    description: string | null; // 允许  为 null
    createdAt: Date;
}

