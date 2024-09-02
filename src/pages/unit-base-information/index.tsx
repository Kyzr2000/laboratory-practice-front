import { Col, Row } from "antd";

import SearchUnits from "./components/search-unit";
import UnitTableList from "./components/unit-list";


const UnitBaseInformation = () => {
    

    return (
        <div>
        <Row style={{height:15}}>
            
            <Col span={14}></Col>
        </Row>
        <Row style={{height:50}}>
            <Col span={1}></Col>
            <Col span={6}>
                <SearchUnits /> {/* 添加 SearchUsers 组件 */}
            </Col>
            <Col span={12}></Col>
            <Col span={4}>

            </Col>
        </Row>
          <UnitTableList />
        </div>
    );
};
export default UnitBaseInformation;
