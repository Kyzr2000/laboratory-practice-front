import { DeleteOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import { Button, Popconfirm } from 'antd';

import { REMOVE_CONSUMER } from '@/pages/graphql/mutations';
import { FIND_ALL } from '@/pages/graphql/query';

import type { Customer } from '../..';

function RemoveConsumer(props: Customer) {
  //   const {data} = useQuery(FIND_ONE)

  const [removeConsumer, { loading, error }] = useMutation(REMOVE_CONSUMER);

  const handleRemove = () => {
    console.log(props.id);
    removeConsumer({
      variables: { id: parseInt(props.id) },
      refetchQueries: [{ query: FIND_ALL }],
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
