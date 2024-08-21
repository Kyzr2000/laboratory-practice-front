
// 定义用户类型
export interface SimpUserType{
    id: number;
    account: string;
    name: string | null; // 允许 name 为 null
    gender: string | null; // 允许 gender 为 null
    age: number | null; // 允许 age 为 null
    is_enabled: boolean | null; // 允许 is_enabled 为 null
}
