import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

const DataTable = () => {
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedDate, setSelectedDate] = useState(null); // Добавляем хук для выбранной даты

  const handleAdd = () => {
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setModalVisible(true);
    form.setFieldsValue(record);
    setSelectedDate(record.date); // Устанавливаем выбранную дату из записи
  };

  const handleDelete = (record) => {
    setData(data.filter((item) => item !== record));
  };

  const handleSave = (values) => {
    const newData = [...data];
    const index = newData.findIndex((item) => item.key === values.key);

    values.date = selectedDate; // Добавляем выбранную дату в значения записи

    if (index > -1) {
      newData[index] = values;
    } else {
      newData.push(values);
    }
    setData(newData);
    setModalVisible(false);
    form.resetFields();
    setSelectedDate(null); // Сбрасываем выбранную дату после сохранения записи
  };

  const columns = [
    {
      title: 'Имя',
      dataIndex: 'name',
    },
    {
      title: 'Дата',
      dataIndex: 'date',
      sorter: (a, b) => a.date.valueOf() - b.date.valueOf(),
    },
    {
      title: 'Числовое значение',
      dataIndex: 'value',
      sorter: (a, b) => a.value - b.value,
    },
    {
      title: 'Действия',
      render: (_, record) => (
        <span>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="text" icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
        </span>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <Button type="primary" onClick={handleAdd}>
          Добавить
        </Button>
      </div>
      <Table dataSource={data} columns={columns} pagination={false} rowKey="key" />
      <Modal
        title="Добавить/Редактировать"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setSelectedDate(null); // Сбросить выбранную дату при закрытии модального окна
        }}
        onOk={() => {
          form.validateFields().then((values) => {
            form.resetFields();
            handleSave(values);
          });
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Имя" rules={[{ required: true, message: 'Введите имя' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="date"
            label="Дата"
            rules={[{ required: true, message: 'Выберите дату' }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              value={selectedDate} // Передаем выбранную дату
              onChange={(date) => setSelectedDate(date)} // Обновляем выбранную дату при изменении
            />
          </Form.Item>
          <Form.Item
            name="value"
            label="Числовое значение"
            rules={[{ required: true, message: 'Введите числовое значение' }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DataTable;
