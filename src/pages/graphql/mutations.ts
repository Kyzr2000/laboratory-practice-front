import { gql } from '@apollo/client';

export const SIGNUP_MUTATION = gql`
  mutation Signup($data: SignupInput!) {
    signup(data: $data) {
      accessToken
      refreshToken
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      user {
        role
      }
      accessToken
      refreshToken
    }
  }
`;
export const AddScaleWarning = gql`
  mutation AddScaleWarning($data: CreateWarningInput!) {
    addScaleWarning(data: $data) {
      id
      uuid
    }
  }
`;
export const AddScaleDiagnostic = gql`
  mutation AddScaleDiagnostic($data: CreateDiagnosticInput!) {
    addScaleDiagnostic(data: $data) {
      id
      uuid
    }
  }
`;
export const DeleteWarning = gql`
  mutation DeleteWarning($id: Int!) {
    deleteWarning(id: $id) {
      id
      createdAt
    }
  }
`;
export const DeleteDiagnostic = gql`
  mutation DeleteDiagnostic($id: Int!) {
    deleteDiagnostic(id: $id) {
      id
      createdAt
    }
  }
`;
export const UpdateWarning = gql`
  mutation UpdateWarning($id: Int!, $data: UpdateWarningInput!) {
    updateWarning(id: $id, data: $data) {
      createdAt
      updatedAt
    }
  }
`;
export const UpdateDiagnostic = gql`
  mutation UpdateDiagnostic($id: Int!, $data: UpdateDiagnosticInput!) {
    updateDiagnostic(id: $id, data: $data) {
      createdAt
      updatedAt
    }
  }
`;

// 用户管理模块
// 创建用户
export const AddUser = gql`
  mutation AddUser($data: AddUser!) {
    addUser(data: $data) {
      createdAt
      updatedAt
    }
  }
`;
// 删除
export const DeleteUser = gql`
  mutation DeleteUser($data: String!) {
    deleteUser(data: $data) {
      username
    }
  }
`;
// 修改用户
export const UpdateUser1 = gql`
  mutation UpdateUser1($data: updateuser1!) {
    updateUser1(data: $data) {
      createdAt
      updatedAt
    }
  }
`;
// 单位管理模块
// 创建单位
export const AddUnit = gql`
  mutation AddUnit($data: AddUnit!) {
    addUnit(data: $data) {
      id
      name
      uuid
      createdAt
    }
  }
`;
// 删除单位
export const DeleteUnit = gql`
  mutation DeleteUnit($data: String!) {
    deleteUnit(data: $data) {
      id
      name
      uuid
      createdAt
    }
  }
`;
// 修改单位
export const UpdateUnit1 = gql`
  mutation UpdateUnit1($data: updateunit1!) {
    updateUnit1(data: $data) {
      id
      name
      uuid
      createdAt
    }
  }
`;
// 社会实践管理模块
// 创建实践
export const AddExperience = gql`
  mutation AddExperience($data: AddExperience!) {
    addExperience(data: $data) {
      address
      createdAt
      endDate
      id
      placeName
      startDate
      user {
        username
      }
    }
  }
`;
// 删除实践
export const DeleteExperience = gql`
  mutation DeleteExperience($data: Int!) {
    deleteExperience(data: $data) {
      address
      createdAt
      endDate
      id
      placeName
      startDate
      user {
        username
      }
    }
  }
`;
// 修改实践
export const UpdateExperience1 = gql`
  mutation UpdateExperience1($data: updateexperience1!) {
    updateExperience1(data: $data) {
      address
      createdAt
      endDate
      id
      placeName
      startDate
      user {
        username
      }
    }
  }
`;

// 技能管理模块
// 创建技能
export const AddSkill = gql`
  mutation AddSkill($data: AddSkill!) {
    addSkill(data: $data) {
      createdAt
      description
      id
      name
      user {
        username
      }
      userSkills {
        userId
        skillId
      }
    }
  }
`;
// 删除技能
export const DeleteSkill = gql`
  mutation DeleteSkill($data: Int!) {
    deleteSkill(data: $data) {
      createdAt
      description
      id
      name
      user {
        username
      }
      userSkills {
        userId
        skillId
      }
    }
  }
`;
// 修改技能
export const UpdateSkill1 = gql`
  mutation UpdateExperience1($data: updateskill1!) {
    updateSkill1(data: $data) {
      createdAt
      description
      id
      name
      user {
        username
      }
      userSkills {
        userId
        skillId
      }
    }
  }
`;
// 给用户添加技能
export const AssignSkillToUser = gql`
  mutation AssignSkillToUser($data: AssignSkillInput!) {
    assignSkillToUser(data: $data) {
      userId
      skillId
      skill {
        name
        description
      }
      user {
        getSkills {
          name
          description
        }
      }
    }
  }
`;
// 给用户解绑技能
export const DeleteSkillToUser = gql`
  mutation DeleteSkillToUser($data: AssignSkillInput!) {
    deleteSkillToUser(data: $data) {
      userId
      skillId
      user {
        getSkills {
          name
          description
        }
      }
    }
  }
`;
