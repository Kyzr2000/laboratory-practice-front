import { gql } from "@apollo/client";

export const GetDemoDashData = gql`
  query getDemoDashData($endTime: Int!) {
    inbounds(end_time: $endTime) {
      date
      total
    }
    outbounds(end_time: $endTime) {
      date
      total
    }
    domesticIp(end_time: $endTime) {
      date
      total
    }
    overseasIp(end_time: $endTime) {
      date
      total
    }
    totalOutFlow(end_time: $endTime) {
      country
      number
    }
  }
`;

// 获取量表基本信息
export const GET_SCALE_BASE_INFORMATION_TABLE_DATA = gql`
  query getScaleBaseInformationTableData(
    $data: GetScaleBaseInformationTableData!
  ) {
    scaleTotalCount(data: $data)
    getScaleBaseInformationTableData(data: $data) {
      id
      name
      isEnable
      skipRule
      isSkip
      isFactor
      createdAt
    }
  }
`;

// 获取量表类型列表
export const GET_SCALE_TYPES = gql`
  query getScaleTypes {
    getScaleTypes {
      id
      name
    }
  }
`;

export const GET_SCALE_DETAIL = gql`
  query getScaleDetail($data: Int!) {
    getScaleDetail(data: $data) {
      name
      scacleCode
      calformula
      tranformulakey
      tranformula
      average
      sd
      scaleInterpretationResult
      baselineScore
      standardSourceMethod
      rawSourceMethod
      averageSourceMethod
      scaleTimeKeeping
      scaleTimeLimit
      introduction
      instructions
      isEnable
      scaleCoverUrl
      scaleContentImg
      isTeam
      teamIntroduction
      isComprehensiveReport
      startAge
      endAge
      warnGender
      skipRule
      isSkip
      isFactor
      scaleTypeId
    }
  }
`;

export const SUBMIT_BASE_INFORMATION = gql`
  mutation submitBaseInformation($data: SubmitBaseInformation!) {
    submitBaseInformation(data: $data) {
      name
    }
  }
`;

// 获取因子列表
export const GET_FACTOR_LIST_QUERY = gql`
  query getFactorList($data: GetFactorListInput!) {
    getFactorNumber(data: $data)
    getFactorList(data: $data) {
      id
      uuid
      name
      introduction
      calformula
      tranformula
      average
      sd
      baseLineScore
      remark
      createdAt
    }
  }
`;

// 获取量表类型
export const GET_SCALE_TYPE_QUERY = gql`
  query getScaleType {
    getScaleType {
      id
      uuid
      name
    }
  }
`;

// 获取量表名称
export const GET_SCALE_NAME_QUERY = gql`
  query getScaleName {
    getScaleName {
      id
      uuid
      name
      scaleTypeId
    }
  }
`;
// 添加与修改因子
export const ADD_FACTOR_MUTATION = gql`
  mutation addFactor($data: CreacteFactorInput!) {
    addFactor(data: $data) {
      id
      uuid
      name
      introduction
      calformula
      tranformula
      average
      sd
      baseLineScore
      remark
      createdAt
    }
  }
`;
// 删除因子
export const DELETE_FACTOR_MUTATION = gql`
  mutation deleteFactor($data: String!) {
    deleteFactor(data: $data) {
      id
      uuid
      name
      introduction
      calformula
      tranformula
      average
      sd
      baseLineScore
      remark
      createdAt
    }
  }
`;
// 获取因子信息
export const GET_FACTOR_QUERY = gql`
  query getFactor($data: String!) {
    getFactorScaleType(data: $data)
    getFactor(data: $data) {
      uuid
      name
      scaleId
      introduction
      calformula
      tranformula
      average
      sd
      baseLineScore
      remark
      createdAt
    }
  }
`;
// 获取量表类型和名称
export const GET_SCALE_TYPE_NAME = gql`
  query GetAllScaleTypes {
    getAllScaleTypeAndName {
      data {
        scaleTypeId: id
        name
      }
    }
  }
`;
// 根据类型获取量表
export const GET_SCALE_BY_TYPEID = gql`
  query GetScaleByType($scaleTypeId: Int!) {
    getScaleByType(scaleTypeId: $scaleTypeId) {
      data {
        id
        name
      }
    }
  }
`;
// 获取表格数据
export const GET_TABLE_DATA = gql`
  query GetTableData($data: QuestionQueryInput, $pagination: PaginationArgs!) {
    getAllSclaeQuestion(data: $data, pagination: $pagination) {
      data {
        id
        name
        questionCode
        questionImg
        answerGroupCode
        isMultiSelect
        timeLimit
        remark
        createdAt
        scale {
          name
          scaleTypeId
        }
      }
      total
    }
  }
`;
// 创建量表问题
export const CREATE_QUESTION_DATA = gql`
  mutation createScaleQuestion($data: ScaleQuestionInput!) {
    createScaleQuestion(data: $data) {
      message
    }
  }
`;
// 更新量表问题
export const UPDATE_QUESTION_DATA = gql`
  mutation UpdateScaleQuestion($id: Int!, $data: ScaleQuestionUpdateInput!) {
    updateScaleQuestion(id: $id, data: $data) {
      id
      message
      success
    }
  }
`;
// 删除量表问题
export const DELETE_QUESITON_DATA = gql`
  mutation deleteScaleQuestionById($id: Int!) {
    deleteScaleQuestionById(id: $id) {
      id
    }
  }
`;

// 获取用户基本信息列表
export const GET_USER_BASE_INFORMATION_LIST = gql`
  query getUserBaseInformationList($data: GetUserBaseInformationTableData!) {
    userTotalCount(data: $data)
    getUserBaseInformationList(data: $data) {
      id
      realname
      username
      gender
      age
      isEnable
    }
  }
`;

// 根据id获取单个用户的详细信息
export const GET_USER_DETAIL = gql`
  query getUserDetail($data: Int!) {
    getUserDetail(data: $data) {
      address
      age
      email
      gender
      introduction
      isEnable
      realname
      role
      username
    }
  }
`;

// 更新（添加）用户信息
export const UPDATE_USER_INFORMATION = gql`
  mutation updateUser($data: UpdateUserInput!, $userId: Int) {
    updateUser(data: $data, userId: $userId) {
      user {
        id
        username
        realname
        age
        email
        isEnable
        isAdmin
        role
      }
      message
      result
    }
  }
`;

// 删除用户
export const DELETE_USER = gql`
  mutation DelUser($delUserId: Int!) {
    delUser(id: $delUserId) {
      message
      result
    }
  }
`;

