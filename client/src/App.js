import React from "react";
import { Button, Row, Col, Input, Form, List, Typography, Checkbox, Spin, Result, Empty } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { TaskService } from "./TaskService.js";

import "antd/dist/antd.dark.css";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.taskService = new TaskService();
    this.state = { isLoading: true, tasks: [], error: undefined };
  }

  componentDidMount() {
    this.loadTasks();
  }

  async loadTasks() {
    try {
      const tasks = await this.taskService.get();
      this.setState({ isLoading: false, tasks: tasks, error: undefined });
    } catch (error) {
      this.setState({ isLoading: false, tasks: [], error: error });
    }
  }

  add = async (values) => {
    try {
      const task = values.task;
      await this.taskService.add(task);
      this.formRef.current.resetFields();
      await this.loadTasks();
    } catch (error) {
      this.setState({ error: error });
    }
  };

  updateCompleted = async (item, completed) => {
    try {
      await this.taskService.updateCompleted(item, completed);
      await this.loadTasks();
    } catch (error) {
      this.setState({ error: error });
    }
  };

  delete = async (item) => {
    try {
      await this.taskService.delete(item);
      await this.loadTasks();
    } catch (error) {
      this.setState({ error: error });
    }
  };

  render() {
    return (
      <div className="App">
        <Row justify="center">
          <Col>
            <h2>My tasks</h2>
          </Col>
        </Row>
        <Row justify="center">
          <Col>
            <Form ref={this.formRef} layout="inline" onFinish={(values) => this.add(values)}>
              <Form.Item name="task" rules={[{ required: true, message: "Task cannot be empty" }]}>
                <Input placeholder="New task..." style={{ width: "453px", marginRight: "8px" }} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Add
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <Row justify="center" style={{ marginTop: "16px" }}>
          <Col>
            <Spin spinning={this.state.isLoading}>
              {this.state.error ? (
                <Result
                  status="500"
                  title="500"
                  subTitle="Sorry, something went wrong."
                  extra={JSON.stringify(this.state.error)}
                />
              ) : (
                <List
                  bordered
                  style={{ width: "518px" }}
                  dataSource={this.state.tasks}
                  locale={{ emptyText: <Empty description="No tasks yet..." /> }}
                  renderItem={(item) => (
                    <List.Item>
                      <Checkbox checked={item.completed} onChange={(e) => this.updateCompleted(item, e.target.checked)}>
                        <Typography.Text delete={item.completed}>{item.action}</Typography.Text>
                      </Checkbox>
                      <Button type="link" size="small" onClick={() => this.delete(item)}>
                        <DeleteOutlined />
                      </Button>
                    </List.Item>
                  )}
                />
              )}
            </Spin>
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
