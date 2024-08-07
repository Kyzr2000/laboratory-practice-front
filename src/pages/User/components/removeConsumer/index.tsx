import { DeleteOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import { Button, Popconfirm } from 'antd';

import { REMOVE_CONSUMER } from '@/pages/graphql/mutations';

// import { FIND_ALL } from "@/pages/graphql/query";
import type { IProps } from '../..';

// import type { Customer } from "../..";

function RemoveConsumer(props: IProps) {
  //   const {data} = useQuery(FIND_ONE)

  const [removeConsumer, { loading, error }] = useMutation(REMOVE_CONSUMER);

  // const { refetchCount } = props;
  // useEffect(() => {
  //   refetch();
  //   refetchCount(); // 初始化时或 currentPage 和 pageSize 变化时执行一次查询
  // }, [currentPage, pageSize, refetch, refetchCount]);

  // useEffect(() => {
  // if (props.refetch) {
  //   props.refetch(); // 先检查是否存在，然后再调用
  // }
  //   if (refetchCount) {
  //     refetchCount(); // 先检查是否存在，然后再调用
  //   }
  // }, [refetchCount]);

  const handleRemove = () => {
    console.log(props.refetch);
    removeConsumer({
      variables: { id: parseInt(props.id) },
      // refetchQueries: [{ query: FIND_ALL }],
    }).then(() => {
      if (props.refetch) {
        props.refetch(); // 先检查是否存在，然后再调用
      }
      if (props.refetchMany) {
        props.refetchMany(); // 先检查是否存在，然后再调用
      }
      if (props.refetchCount) {
        props.refetchCount(); // 先检查是否存在，然后再调用
      }
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error:{error.message}</p>;

  return (
    <Popconfirm title="是否确认删除此项" onConfirm={handleRemove}>
      <Button type="primary" icon={<DeleteOutlined />} danger />
    </Popconfirm>
  );
}

export default RemoveConsumer;
