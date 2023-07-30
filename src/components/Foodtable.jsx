import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, InputNumber } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import styles from './FoodTable.module.css';

const FoodTable = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [foodDate, setDate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const columns = [
    {
      title: 'Дата',
      dataIndex: 'date',
      sorter: (a, b) => a.date.localeCompare(b.date),
      width: '20%',
    },
    {
      title: 'Блюдо',
      dataIndex: 'dish',
      sorter: (a, b) => a.dish.localeCompare(b.dish),
      width: '20%',
    },
    {
      title: 'Приём пищи',
      dataIndex: 'food_taking',
      filters: [
        {
          text: 'Завтрак',
          value: 'Завтрак',
        },
        {
          text: 'Обед',
          value: 'Обед',
        },
        {
          text: 'Ужин',
          value: 'Ужин',
        },
      ],
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.food_taking.includes(value),
      width: '10%',
    },
    {
      title: 'Калорийность',
      dataIndex: 'value',
      sorter: (a, b) => a.value - b.value,
      width: '10%',
    },
    {
      title: 'Редактировать таблицу',
      dataIndex: 'actions',
      width: '20%',
      render: (_, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              handleEdit(record);
            }}
          />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.key)} />
        </>
      ),
    },
  ];

  // Открытие модального окна
  const handleAdd = () => {
    setModalVisible(true);
  };

  // Редактирование в модальном окне
  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  // Удаление строки из таблицы
  const handleDelete = (key) => {
    const newData = data.filter((record) => record.key !== key);
    setData(newData);
  };

  // Блок функций для управления форматом даты
  const addLeadingZero = (o) => {
    return o < 10 ? '0' + o : o;
  };

  const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

  function getUserDate(t) {
    const date = new Date(t);
    let Y = date.getFullYear();
    let M = addLeadingZero(date.getMonth() + 1);
    let D = addLeadingZero(date.getDate());
    let d = days[date.getDay()];
    return setDate(`${Y}/${M}/${D} (${d})`);
  }

  // Добавление нового элемента / сохранение изменения элемента
  const handleSave = () => {
    form.validateFields().then((values) => {
      form.resetFields();
      setModalVisible(false);
      values.date = foodDate;

      if (editingRecord) {
        const newData = data.map((record) => {
          if (record.key === editingRecord.key) {
            return { ...record, ...values };
          }
          return record;
        });
        setData(newData);
        setEditingRecord(null);
      } else {
        const newRecord = {
          key: data.length + 1,
          ...values,
        };
        setData([newRecord, ...data]);
      }
    });
  };

  // Закрытие модального окна и очистка полей объекта
  const handleCancel = () => {
    setModalVisible(false);
    setEditingRecord(null);
    form.resetFields();
  };

  // Поиск по таблице
  const handleSearch = (value) => {
    const searchData = data.filter((record) => {
      // Проверяем наличие значения во всех полях записи
      return Object.values(record).some(
        (fieldValue) =>
          typeof fieldValue === 'string' && fieldValue.toLowerCase().includes(value.toLowerCase()),
      );
    });
    if (searchData.length !== 0) {
      setData([...searchData, ...data]);
    } else {
      return <div>Блюдо не обнаружено</div>;
    }
  };
  return (
    <div className={styles.table_wrapper}>
      <div className={styles.search_box}>
        <Button type="default" onClick={handleAdd}>
          Добавить запись
        </Button>
        <Input.Search
          placeholder="Найти в таблице"
          onSearch={handleSearch}
          className={styles.search}
        />
      </div>

      <Table columns={columns} dataSource={data} pagination={false} size="small" />

      <Modal
        title={editingRecord ? 'Редактирование записи' : 'Добавление записи'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="dish"
            label="Блюдо"
            rules={[{ required: true, message: 'Введите назваеие блюда' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="food_taking"
            label="Приём пищи"
            rules={[{ required: true, message: 'Введите приём пищи (завтрак/обед/ужин)' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="date"
            label="Дата"
            rules={[{ required: true, message: 'Выберите дату' }]}
          >
            <Input placeholder="Введите дату" onChange={(e) => getUserDate(e.target.value)} />
          </Form.Item>
          <Form.Item
            name="value"
            label="Калорийность блюда"
            rules={[
              { required: true, message: 'Введите калорийность блюда' },
              { type: 'number', message: 'Введите корректную калорийность блюда' },
            ]}
          >
            <InputNumber />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FoodTable;
