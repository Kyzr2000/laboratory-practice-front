
// 定义用户类型
export interface UnitType{
    id: number;
    unitCode: string;
    unitName: string | null; // 允许 name 为 null
    created_at: Date | null;
}
